const calculateEntropy = require('./entropy');
const {
	BASE64_REGEX,
	MD5_REGEX,
	STRINGS_REGEX,
	URL_REGEX,
	EMAIL_REGEX,
	USERNAME_REGEX,
	GOOGLE_API_KEY_REGEX,
	GOOGLE_APP_ID_REGEX,
} = require('./regexes');

// Список подозрительных ключевых слов
const suspiciousWords = [
	'secret', 'password', 'api_key', 'access_token', 'private_key',
	'apikey', 'client_secret', 'auth_token', 'authorization', 'confidential',
	'secret_key',
	'private_data', 'app_secret',
	'authentication', 'user_secret', 'encryption',
	'Bearer'
];

module.exports = function findSensitiveData(
	code,
	sensitivityLevel = 1,
	entropyLevel = 4.5,
	appendAllVarStrings = false) {
	const foundData = [];
	const lines = code.split('\n');

	// Уровень 1: Поиск строк с высокой энтропией
	for (let line of lines) {
		if (line.slice(0,2) === '//') continue;
		if (line.includes('JADX INFO')) continue;
		const matches = line.matchAll(STRINGS_REGEX); // Извлекаем строки из кавычек
		for (let match of matches) {
			const string = match[0];
			if (string) {
				const entropy = calculateEntropy(string);

				// Сохраняем строку и её энтропию
				if (appendAllVarStrings) {
					foundData.push({
						type: 'string',
						data: string.trim(),
						value: entropy,
					});
				}

				// Если уровень чувствительности ≥ 1 и энтропия выше порога
				if (sensitivityLevel >= 1 && entropy > entropyLevel) {
					foundData.push({
						type: 'high_entropy',
						data: string.trim(),
						value: entropy,
					});
				}
			}
		}
	}

	// Уровень 2: Проверка регулярных выражений
	if (sensitivityLevel >= 2) {
		const regexes = [
			{ type: 'base64', regex: BASE64_REGEX },
			{ type: 'md5', regex: MD5_REGEX },
			{ type: 'url', regex: URL_REGEX },
			{ type: 'email', regex: EMAIL_REGEX },
			{ type: 'username', regex: USERNAME_REGEX },
			{ type: 'google_api_key', regex: GOOGLE_API_KEY_REGEX },
			{ type: 'google_app_id', regex: GOOGLE_APP_ID_REGEX },
		];

		regexes.forEach(({ type, regex }) => {
			const matches = code.match(regex);
			if (matches) {
				matches.forEach((match) => {
					if (match) {
						foundData.push({
							type: 'regex',
							data: match.trim(),
						});
					}
				});
			}
		});
	}

	// Уровень 3: Поиск подозрительных слов в каждой строке
	if (sensitivityLevel >= 3) {
		lines.forEach((line) => {
			if (line.slice(0,2) === '//') return;
			if (line.includes('JADX INFO')) return;
			suspiciousWords.forEach((word) => {
				const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Ищем слово в контексте строки
				if (regex.test(line)) { // Если слово найдено в строке
					foundData.push({
						type: 'sus_word',
						data: line.trim(),
						keyword: word, // Сохраняем ключевое слово, которое вызвало подозрение
					});
				}
			});
		});
	}

	return foundData;
};
