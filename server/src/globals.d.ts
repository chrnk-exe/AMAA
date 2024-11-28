declare type enumerateTypes = 'apps' | 'processes'

interface LsResponseFrida {
	path: string;          // Путь к директории
	readable: boolean;     // Может ли процесс читать директорию
	writeable: boolean;    // Может ли процесс записывать в директорию
	files: FileInfoJava[]; // Список файлов в директории
}

interface FileInfoFrida {
	isDirectory: boolean;
	isFile: boolean;
	isHidden: boolean;
	lastModified: number;  // Последнее изменение в миллисекундах с эпохи Unix
	size: number;          // Размер файла/директории
	path: string;          // Абсолютный путь
	readable: boolean;     // Доступен ли файл для чтения
	writeable: boolean;    // Доступен ли файл для записи
	executable: boolean;   // Доступен ли файл для выполнения
}