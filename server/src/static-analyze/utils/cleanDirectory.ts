import fs from 'fs';
import path from 'path';

// Функция для удаления содержимого папки
function clearDirectory(directory: string): void {
	// Читаем содержимое папки
	fs.readdir(directory, (err, files) => {
		if (err) {
			console.error('Ошибка при чтении папки:', err);
			return;
		}

		// Для каждого файла в папке выполняем удаление
		files.forEach((file) => {
			const filePath = path.join(directory, file);

			// Получаем информацию о файле
			fs.stat(filePath, (err, stats) => {
				if (err) {
					console.error('Ошибка при получении информации о файле:', err);
					return;
				}

				// Если это файл, удаляем его
				if (stats.isFile()) {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error('Ошибка при удалении файла:', err);
						}
						// else {
						// 	console.log(`Файл ${file} удалён`);
						// }
					});
				}
				// Если это папка, рекурсивно очищаем её
				else if (stats.isDirectory()) {
					clearDirectory(filePath);  // Рекурсивный вызов для вложенных папок
				}
			});
		});
	});
}

// Очистка папки 'files'
export default clearDirectory;
