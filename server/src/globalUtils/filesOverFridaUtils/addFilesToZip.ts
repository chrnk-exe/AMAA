import JSZip from 'jszip';
import { Script } from 'frida';
import { relative } from 'path';

export const addFilesToZip = async (
	zip: JSZip,
	path: string,
	listFunction: (path: string, script: Script) => Promise<LsResponseFrida>,
	readFunction: (file: FileInfoFrida, script: Script) => Promise<Buffer>,
	script: Script) =>
{
	const directoryInfo = await listFunction(path, script);

	if (!directoryInfo.readable) {
		console.warn(`Директория ${path} недоступна для чтения`);
		return;
	}

	for (const file of directoryInfo.files) {
		const relativePath = relative(directoryInfo.path, file.path);
		if (file.isFile && file.readable) {
			// Читаем содержимое файла
			const fileData = await readFunction(file, script);
			// Добавляем файл в архив
			zip.file(relativePath, Buffer.from(fileData));
		} else if (file.isDirectory) {
			// Рекурсивно обрабатываем директории
			const folder = zip.folder(relativePath);
			if (folder) {
				await addFilesToZip(folder, file.path, listFunction, readFunction, script);
			}
		}
	}
};