import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';

const staticAnalyze = async (filename: string) => {
	const apkData = fs.readFileSync(filename);
	const zip = await JSZip.loadAsync(apkData);
	console.log(`STATIC ANALYZE: [${__dirname}]`);

	const outputDir = path.join(__dirname, 'files');

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

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
			}
		})
	);

	console.log('Starting static analyze');
};

export default staticAnalyze;