const calculateEntropy = require('./entropy');
const {
	MD5_REGEX,
	BASE64_REGEX,
	EMAIL_REGEX,
	GOOGLE_API_KEY_REGEX,
	GOOGLE_APP_ID_REGEX,
	STRINGS_REGEX,
	URL_REGEX,
	USERNAME_REGEX } = require('./regexes');

const suspiciousWords = ['secret', 'password', 'api_key', 'access_token', 'private_key', 'credentials',
	'apikey', 'client_secret', 'auth_token', 'authorization', 'confidential',
	'token', 'key', 'login', 'user', 'username', 'secret_key', 'oauth', 'user_token',
	'access', 'private_data', 'app_secret', 'salt', 'hash', 'login_data', 'login_info',
	'authentication', 'user_secret', 'encryption', 'decrypt', 'protected', 'login_pass'];


module.exports = function findSensitiveData(code, sensitivityLevel = 1, entropyLevel = 3.5) {
	const foundData = [];

	// Уровень 1: Поиск данных с высокой энтропией
	if (sensitivityLevel >= 1) {
		const lines = code.split('\n');
		for (let line of lines) {
			// Пропускаем пустые строки
			if (line) {
				if (line.trim() === '') continue;

				// Проверяем строку на наличие ключей или паролей с высокой энтропией
				if (calculateEntropy(line) > entropyLevel) {  // Можно настроить порог энтропии
					foundData.push({
						type: 'high_entropy',
						data: line.trim(),
						value: calculateEntropy(line)
					});
				}
			}
		}
	}

	// Уровень 2: Поиск ключевых слов и регулярных выражений
	if (sensitivityLevel >= 2) {
		const regexes = [BASE64_REGEX, MD5_REGEX, STRINGS_REGEX, URL_REGEX, EMAIL_REGEX, USERNAME_REGEX, GOOGLE_API_KEY_REGEX, GOOGLE_APP_ID_REGEX];
		regexes.forEach((regex) => {
			const matches = code.match(regex);
			if (matches) {
				matches.forEach((match) => {
					if (match) {
						foundData.push({
							type: regex.source,  // Используем исходный шаблон как тип
							data: match.trim(),
						});
					}
				});
			}
		});
	}

	// Уровень 3: Поиск подозрительных данных по ключевым словам
	if (sensitivityLevel >= 3) {
		suspiciousWords.forEach((word) => {
			const regex = new RegExp(`\\b${word}\\b`, 'gi');  // Ищем слово как отдельное
			const matches = code.match(regex);
			if (matches) {
				matches.forEach((match) => {
					if (match) {
						foundData.push({
							type: 'suspicious',
							data: match.trim(),
						});
					}
				});
			}
		});
	}

	return foundData;
};
