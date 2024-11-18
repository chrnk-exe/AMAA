import fs from 'fs';
import path from 'path';
// import * as worker_threads from 'worker_threads';
import {Worker} from 'node:worker_threads';

// const __dirname = 'C:\\Users\\i.kotov\\Desktop\\my_projects\\study_research\\work\\server\\src\\static-analyze';

function collectJavaFilesSync(dir: string) {
	let files: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files = files.concat(collectJavaFilesSync(fullPath));
		} else if (entry.isFile() && fullPath.endsWith('.java')) {
			files.push(fullPath);
		}
	}

	return files;
}

// Функция для обработки файла в воркере
function processFileInWorker(filePath: string): Promise<{ file: string; result: object }> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(path.join(__dirname, 'analyzeFile.js'), { workerData: filePath });

		worker.on('message', (message) => {
			if (message.success) {
				resolve({ file: message.file, result: message.result }); // Возвращаем результат анализа
			} else {
				reject(new Error(`Ошибка обработки файла ${message.file}: ${message.error}`)); // Обрабатываем ошибку
			}
		});

		worker.on('error', reject);

		worker.on('exit', (code) => {
			if (code !== 0) {
				reject(new Error(`Worker stopped with exit code ${code}`));
			}
		});
	});
}

async function analyzeJavaApkCode(pathToDecompiledDex: string, threads = 4) {
	console.log(pathToDecompiledDex);

	const javaFilenames = collectJavaFilesSync(pathToDecompiledDex);

	const results: Record<string, object> = {};

	try {
		// Обрабатываем файлы в несколько потоков
		const tasks = [];
		for (const file of javaFilenames) {
			tasks.push(
				processFileInWorker(file).then(({ file, result }) => {
					results[file] = result; // Сохраняем результат
				})
			);
			if (tasks.length >= threads) {
				await Promise.all(tasks); // Дожидаемся завершения текущих задач
				tasks.length = 0; // Очищаем очередь
			}
		}

		// Дожидаемся завершения оставшихся задач
		await Promise.all(tasks);

		console.log('Все файлы обработаны.');
		console.log(results);
	} catch (error) {
		console.error('Ошибка!');
	}

	return {
		audited: true
	};
}


export default analyzeJavaApkCode;