import calculateEntropy from '../static-analyze/checks/entropy';
import {
	BASE64_REGEX,
	EMAIL_REGEX,
	GOOGLE_API_KEY_REGEX, GOOGLE_APP_ID_REGEX,
	MD5_REGEX,
	URL_REGEX,
	USERNAME_REGEX,
} from '../static-analyze/checks/regexes';

const suspiciousWords = [
	'secret', 'password', 'api_key', 'access_token', 'private_key',
	'apikey', 'client_secret', 'auth_token', 'authorization', 'confidential',
	'secret_key',
	'private_data', 'app_secret',
	'authentication', 'user_secret', 'encryption',
	'Bearer'
];

export const checkSecretsStr = (str: string, entropyLevel = 4.5): secretResult[] => {
	const foundData: secretResult[] = [];

	// Проверяем энтропию всей строки
	const entropy = calculateEntropy(str);
	if (entropy > entropyLevel) {
		foundData.push({
			type: 'high_entropy',
			data: str,
			value: entropy,
		});
	}

	// Проверяем на совпадение с регулярными выражениями
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
		const matches = str.match(regex);
		if (matches) {
			matches.forEach(match => {
				foundData.push({
					type: 'regex',
					data: match,
				});
			});
		}
	});

	// Проверяем на наличие подозрительных ключевых слов
	suspiciousWords.forEach(word => {
		const regex = new RegExp(`\\b${word}\\b`, 'gi');
		if (regex.test(str)) {
			foundData.push({
				type: 'sus_word',
				data: str,
				keyword: word,
			});
		}
	});

	return foundData;
};