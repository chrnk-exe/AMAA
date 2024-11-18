import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import manifestAnalyze from './manifest-analyze';
import cleanDirectory from './utils/cleanDirectory';
import certAnalyze from './cert-analyze/cert-analyze';
import { execSync } from 'child_process';
import fileAnalyzer from './file-analyzer';

const regex = /^classes(\d*)\.dex$/;

const decompileDex = (pathToFolderWithClassesDex: string) => {

	const jadxCLI = path.join(__dirname, 'tools', 'jadx-cli.jar');
	const outputDirectory = path.join(__dirname, 'decompiled');

	const classesFiles = fs.readdirSync(pathToFolderWithClassesDex).filter(file => regex.test(file));

	const resultClassesFiles = classesFiles.map(classesFilename => path.join(__dirname, 'files', classesFilename));


	// decompile with jadx
	const args = ['java', '-cp', jadxCLI, 'jadx.cli.JadxCLI',
		'--deobf', '--show-bad-code', '--escape-unicode', '--threads-count 4',
		'-d', outputDirectory ,...resultClassesFiles];

	execSync(args.join(' '), { stdio: 'pipe' }).toString('utf-8');

};

const staticAnalyze = async (filename: string) => {
	const apkData = fs.readFileSync(filename);
	const zip = await JSZip.loadAsync(apkData);
	console.log(`STATIC ANALYZE: [${__dirname}]`);

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
				console.log(`Writing ${fullPath}`);
			}
		})
	);

	const androidManifestPath = __dirname + '/files/AndroidManifest.xml';

	console.log('Starting static analyze');

	// const manifestAnalyzingResult = manifestAnalyze(androidManifestPath);
	//
	// const certAnalyzeResult = certAnalyze(filename);

	// decompile and store files in __dirname/decompiled/sources
	decompileDex(__dirname + '/files');

	const decompiledPath = path.join(__dirname, 'decompiled', 'sources');

	const codeAuditResult = fileAnalyzer(decompiledPath);

};

export default staticAnalyze;