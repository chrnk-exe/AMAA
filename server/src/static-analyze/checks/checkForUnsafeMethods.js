const unsafePatterns = [
	// Поиск вызова system
	/system\s*\(/i,

	// Поиск использования exec или execSync (часто используется для выполнения команд)
	/exec\s*\(/i,
	/execSync\s*\(/i,

	// Поиск вызова Runtime.exec()
	/Runtime\.exec\s*\(/i,

	// Поиск использования ProcessBuilder
	/ProcessBuilder\s*\(/i,

	// Поиск использования sudo, root или других ключевых слов, указывающих на привилегированные команды
	/\b(sudo|root|su)\b/i,
];

// Функция для поиска небезопасных вызовов
function findUnsafeCalls(code) {
	const results = [];

	unsafePatterns.forEach(pattern => {
		const matches = code.match(pattern);
		if (matches) {
			results.push(...matches);
		}
	});

	return results;
}

module.exports = findUnsafeCalls;
