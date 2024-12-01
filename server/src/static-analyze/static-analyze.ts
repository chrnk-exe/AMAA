import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import { Database } from 'sqlite';
import { execSync } from 'child_process';

import cleanDirectory from './utils/cleanDirectory';
import numberToAttributes from './utils/numToAttributes';
import attributesToNumber from './utils/attrToNumber';
import appendManifestAnalysisToDB from './utils/appendManifestAnalysisToDB';
import appendCodeAnalysisToDB from './utils/appendCodeAnalysisToDB';

import { createScan } from '../db/services/scan/createScan';
import { createStaticResult } from '../db/services/static/createStaticResult';
import { updateScanStatus } from '../db/services/scan/changeStatus';

import manifestAnalyze from './manifest-analyze';
import certAnalyze from './cert-analyze/cert-analyze';
import fileAnalyzer from './file-analyzer';
import getHardcodedCertKeystore from './cert-analyze/getHardcodedCertsKeystore';

import SocketSingleton from '../globalUtils/socketSingleton';

import { writeFile } from 'fs/promises';

async function saveObjectToFile(filePath: string, data: any): Promise<void> {
	try {
		// Преобразуем объект в строку JSON
		const jsonData = JSON.stringify(data, null, 2); // null и 2 — для форматирования с отступами
		// Сохраняем в файл
		await writeFile(filePath, jsonData, 'utf8');
		console.log(`Данные успешно сохранены в файл: ${filePath}`);
	} catch (error) {
		console.error(`Ошибка при сохранении данных в файл: ${(error as Error).message}`);
	}
}



interface staticAnalyzeSettings {
	threads?: number,
	entropyLevel?: number,
	sensitivityLevel?: number
	appendAllVarStrings?: boolean
}

const decompileDex = async (pathToFolderWithClassesDex: string) => {
	const regex = /^classes(\d*)\.dex$/;
	const jadxCLI = path.join(__dirname, 'tools', 'jadx-cli.jar');
	const outputDirectory = path.join(__dirname, 'decompiled');
	const classesFiles = fs.readdirSync(pathToFolderWithClassesDex).filter(file => regex.test(file));
	const resultClassesFiles = classesFiles.map(classesFilename => path.join(__dirname, 'files', classesFilename));
	// decompile with jadx
	const args = ['java', '-cp', jadxCLI, 'jadx.cli.JadxCLI',
		'--deobf', '--show-bad-code', '--escape-unicode', '--threads-count 10',
		'-d', outputDirectory ,...resultClassesFiles];

	execSync(args.join(' '), { stdio: 'pipe' }).toString('utf-8');
	return 0;
};

const staticAnalyze = async (filename: string, db: Database, settings?: staticAnalyzeSettings) => {
	const apkFilename = filename.split('/')[filename.split('/').length - 1];
	const apkData = fs.readFileSync(filename);
	const zip = await JSZip.loadAsync(apkData);

	const outputDir = path.join(__dirname, 'files');
	const decompiledDir = path.join(__dirname, 'decompiled');


	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	if (!fs.existsSync(decompiledDir)) {
		fs.mkdirSync(decompiledDir, { recursive: true });
	}

	// Очистить перед распаковкой нового apk
	cleanDirectory(outputDir);
	cleanDirectory(decompiledDir);

	const filenamesInApk: string[] = [];
	if (SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Unpacking...');
	// Проходимся по всем файлам в ZIP-архиве
	await Promise.all(
		Object.keys(zip.files).map(async (relativePath) => {
			const file = zip.files[relativePath];
			const fullPath = path.join(outputDir, relativePath);

			if (file.dir) {
				// Создаем директорию, если это папка
				if (!fs.existsSync(fullPath)) {
					fs.mkdirSync(fullPath, { recursive: true });
				}
			} else {
				// Создаем директорию для файла, если её нет
				const dir = path.dirname(fullPath);
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
				// Извлекаем файл и записываем его на диск
				const content = await file.async('nodebuffer');
				fs.writeFileSync(fullPath, content);
				filenamesInApk.push(fullPath);
				console.log(`Writing ${fullPath}`);
			}
		})
	);

	const androidManifestPath = __dirname + '/files/AndroidManifest.xml';
	if (SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing AndroidManifest.xml...');
	const manifestAnalyzingResult = manifestAnalyze(androidManifestPath);

	const {
		packageName,
		version,
		permissionsAnalyze,
		SDKAnalyze,
		criticalAttributesAnalyze,
		exportedEntitiesAnalyze,
		intentFiltersAnalyze
	} = manifestAnalyzingResult;


	const scanId = await createScan(db, apkFilename, packageName, version ? version : '1', 'static');

	if (SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing signing alg...');
	const certAnalyzeResult = certAnalyze(filename);

	const certVersions = certAnalyzeResult
		.map((value, index) => value ? index + 1 : -1)  // Индексы с 1, а не с 0
		.filter(index => index !== -1)  // Убираем -1 (где значение было false)
		.join(',');  // Собираем индексы в строку, разделяя их запятыми

	const hardcodedCerts = getHardcodedCertKeystore(filenamesInApk);

	const StaticResultId = await createStaticResult(
		db,
		scanId,
		certVersions,
		null, // надо убрать это говно...
		permissionsAnalyze.join(','),
		SDKAnalyze.dangerousMinSDK,
		SDKAnalyze.dangerousTargetSDK,
		attributesToNumber(criticalAttributesAnalyze)
	);


	appendManifestAnalysisToDB(db, StaticResultId, hardcodedCerts, exportedEntitiesAnalyze, intentFiltersAnalyze);

	if (SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'decompiling dex...');
	await decompileDex(__dirname + '/files');

	const decompiledPath = path.join(__dirname, 'decompiled', 'sources');
	if (SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing code...');
	if (settings) {
		const codeAuditResult = await fileAnalyzer(
			decompiledPath,
			settings.threads,
			settings.entropyLevel,
			settings.sensitivityLevel,
			settings.appendAllVarStrings
		);
		if (codeAuditResult) {
			await appendCodeAnalysisToDB(db, StaticResultId, codeAuditResult);
		} else {
			if(SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing code failed...');
		}
	} else {
		const codeAuditResult = await fileAnalyzer(decompiledPath);
		if (codeAuditResult) {
			await appendCodeAnalysisToDB(db, StaticResultId, codeAuditResult);
		} else {
			if(SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing code failed...');
		}
	}

	if(SocketSingleton.io) SocketSingleton.io.emit('staticAnalyzeEv', 'Analyzing code finished...');

	updateScanStatus(db, scanId, 'finished');

	return;
};

export default staticAnalyze;