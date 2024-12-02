declare type enumerateTypes = 'apps' | 'processes'

type DbQueryResponseJava = Array<Array<string>>

interface LsResponseFrida {
	path: string;          // Путь к директории
	readable: boolean;     // Может ли процесс читать директорию
	writeable: boolean;    // Может ли процесс записывать в директорию
	files: FileInfoJava[]; // Список файлов в директории
}

interface PackageInfoResponseJava {
	package_name: string;  // Имя пакета приложения
	package_version: string; // Версия приложения
	directories: DirectoryInfoJava[]; // Список директорий, связанных с приложением
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

interface Application {
	activities: Component[];
	services: Component[];
	receivers: Component[];
	providers: Component[];
}

interface Component {
	attributes: Attribute[];
	childNodes: ChildNode[];
}

interface ExportedEntity {
	category: string;
	name: string;
}

interface Attribute {
	nodeName: string;
	typedValue: {
		value: boolean;
	};
	value?: string;
}

interface ChildNode {
	nodeName: string;
	attributes: Attribute[]
}

interface IntentFilterData {
	schemes: string[];
	hosts: string[];
	paths: string[];
	pathPrefixes: string[];
	pathPatterns: string[];
}

type CriticalAttributes = {
	debuggable: boolean,
	allowBackup: boolean,
	usesCleartextTraffic: boolean
}

interface ManifestAnalyzeResult {
	packageName: string;
	version?: string;
	permissionsAnalyze: string[];
	exportedEntitiesAnalyze: ExportedEntity[];
	intentFiltersAnalyze: IntentFilterData;
	criticalAttributesAnalyze: CriticalAttributes;
	SDKAnalyze: {
		dangerousTargetSDK: SDKAnalyze;
		dangerousMinSDK: SDKAnalyze;
	};
	isHttpInSchemes: boolean;
}

interface stringTypes {
	STRING: 'string',
	HIGH_ENTROPY:'high_entropy',
	REGEX: 'regex',
	SUS_WORD: 'sus_word'
}

interface secretResult {
	type: 'string' | 'high_entropy' | 'regex' | 'sus_word'
	data: string
	value?: number
	keyword?: string
}

interface CodeAuditResult {
	fileName: string
	codeLength: number
	analyzed: boolean
	domainResult: {
		domains: string[]
	}
	SQLResult: {
		sqlQueries: string[]
	}
	SecretsResult: {
		type: 'string' | 'high_entropy' | 'regex' | 'sus_word'
		data: string
		value?: number
		keyword?: string
	}[],
	unsafeMethods: {
		line: number
		code: string
		pattern: string
	}[],
	weakCrypto: {
		algorithm: string,
		line: number, // Номер строки
		code: string, // Содержимое строки
	}[]
}

type ReportDetail = {
	section: string; // Название секции
	content: string[]; // Список строк с деталями секции
};

type ReportData = {
	title: string; // Заголовок отчёта
	date: string; // Дата генерации отчёта
	summary: string; // Краткое описание
	appName: string; // Название приложения
	packageName: string; // Имя пакета
	scanType: string; // Тип сканирования (static/dynamic)
	details: ReportDetail[]; // Массив секций с их содержимым
};
