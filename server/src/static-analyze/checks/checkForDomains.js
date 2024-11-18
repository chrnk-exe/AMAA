// Регулярное выражение для поиска доменных имен, начинающихся с схемы (например, http://, https://)
const domainRegex = /\b(?:https?|ftp|file|mailto|data):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;

/**
 * Поиск доменных имен в Java-коде
 * @param {string} javaCode - Содержимое Java-файла
 * @returns {Object} Результат проверки
 */
module.exports = function findDomainNames(javaCode) {
	const matches = javaCode.match(domainRegex);
	return { domains: matches ? Array.from(new Set(matches)) : [] };
};
