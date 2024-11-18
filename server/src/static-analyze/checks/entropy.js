
const SINGLE_LINE_COMMENT_REGEX = /\/\/.*$/;

// Регулярное выражение для поиска многострочных комментариев
const MULTI_LINE_COMMENT_REGEX = /\/\*[\s\S]*?\*\//;

const MIN_LENGTH = 8;  // Минимальная длина строки для анализа
const MAX_LENGTH = 200; // Максимальная длина строки для анализа

// Удаляем однострочные и многострочные комментарии
function removeComments(inputString) {
	return inputString
		.replace(SINGLE_LINE_COMMENT_REGEX, '')  // Убираем все однострочные комментарии
		.replace(MULTI_LINE_COMMENT_REGEX, '');  // Убираем все многострочные комментарии
}


module.exports = (str) => {
	// Игнорируем регистр, приводим строку к нижнему регистру

	// if (str.length < MIN_LENGTH || str.length > MAX_LENGTH || exclude(str)) {
	// 	return 0;
	// }

	if (str.length < MIN_LENGTH || str.length > MAX_LENGTH) {
		return 0;
	}

	// Убираем комментарии из строки
	const cleanedString = removeComments(str);

	// Если после удаления комментариев строка становится пустой, игнорируем её
	if (cleanedString.length === 0) {
		return 0;
	}

	const normalizedStr = str.toLowerCase();

	const frequency = {};
	for (let i = 0; i < normalizedStr.length; i++) {
		frequency[normalizedStr[i]] = (frequency[normalizedStr[i]] || 0) + 1;
	}

	let entropy = 0;
	const len = normalizedStr.length;
	for (let char in frequency) {
		const p = frequency[char] / len;
		entropy -= p * Math.log2(p);
	}

	return entropy;
};