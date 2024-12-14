import fs from 'fs';
import path from 'path';
import { Worker } from 'node:worker_threads';

// Генератор для ленивого обхода файлов
function* collectJavaFiles(dir: string): Generator<string> {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* collectJavaFiles(fullPath); // Рекурсивный обход
		} else if (entry.isFile() && fullPath.endsWith('.java')) {
			yield fullPath; // Возвращаем файл
		}
	}
}

// Обработка одного файла с использованием воркера
function processFileInWorker(
	filePath: string,
	entropyLevel: number,
	includeHighEntropy: boolean,
	includeKeywords: boolean,
	includeRegexes: boolean,
	includeAllStrings: boolean
): Promise<{ file: string; result: object }> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(path.join(__dirname, 'analyzeFile.js'), {
			workerData: { file: filePath, entropyLevel, includeHighEntropy, includeKeywords, includeRegexes, includeAllStrings },
		});

		worker.on('message', (message) => {
			if (message.success) {
				resolve({ file: message.file, result: message.result });
			} else {
				reject(new Error(`Ошибка обработки файла ${message.file}: ${message.error}`));
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

// Основная функция анализа с ограничением количества потоков
async function analyzeJavaApkCode(
	pathToDecompiledDex: string,
	threads = 4,
	entropyLevel = 4.6,
	includeHighEntropy = true,
	includeKeywords= true,
	includeRegexes= true,
	includeAllStrings= true
) {
	console.log(`Starting analysis in ${pathToDecompiledDex}, threads: ${threads}`);
	const fileIterator = collectJavaFiles(pathToDecompiledDex); // Используем генератор
	const results: Record<string, CodeAuditResult> = {};
	const tasks: Promise<void>[] = [];

	// Очередь для обработки файлов
	const processQueue = async () => {
		for (const file of fileIterator) {
			// Обрабатываем текущий файл
			const task = processFileInWorker(file, entropyLevel, includeHighEntropy,
				includeKeywords,
				includeRegexes,
				includeAllStrings)
				.then(({ file, result }) => {
					results[file] = result as CodeAuditResult;
				})
				.catch((error) => {
					console.error(`Error processing ${file}: ${error.message}`);
				});
			tasks.push(task);

			// Если количество задач >= максимального числа потоков, ждем завершения хотя бы одной
			if (tasks.length >= threads) {
				await Promise.race(tasks);
				// Удаляем завершённые задачи
				tasks.splice(
					0,
					tasks.findIndex((task) => task instanceof Promise) + 1
				);
			}
		}
	};

	try {
		await processQueue();
		// Ждем завершения оставшихся задач
		await Promise.all(tasks);
	} catch (error) {
		console.error('An error occurred during the processing:', error);
		return false;
	}

	return results;
}

export default analyzeJavaApkCode;
