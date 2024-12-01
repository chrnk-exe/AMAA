const unsafePatterns = [
	// Вызов метода Runtime.getRuntime().exec()
	/Runtime\.getRuntime\(\)\.exec\s*\(/i,

	// Вызов ProcessBuilder
	/new\s+ProcessBuilder\s*\(/i,

	// Вызов java.lang.System.setProperty
	/System\.setProperty\s*\(/i,

	// Использование Shell-команд через exec
	/\.exec\s*\(/i,

	// Вызов методов с потенциально небезопасными параметрами (например, SQL или HTTP)
	/DriverManager\.getConnection\s*\(/i, // Подключение к базе данных
	/URLConnection\.openConnection\s*\(/i, // Создание URL-соединения

	// Использование команд с повышенными правами (sudo, root)
	/\b(sudo|root|su)\b/i,

	// Использование Android Log с утечкой данных (например, Log.d, Log.e)
	// /Log\.[dweiv]\s*\(/i,

	// Вызов небезопасных методов Android для выполнения системных команд
	/ShellUtils\.execCommand\s*\(/i,
	/Runtime\.exec\s*\(/i,
];


// Функция для поиска небезопасных вызовов
function findUnsafeCalls(code) {
	const results = [];
	const lines = code.split('\n'); // Разбиваем код на строки

	lines.forEach((line, index) => {
		unsafePatterns.forEach((pattern) => {
			if (pattern.test(line)) { // Если строка содержит совпадение
				results.push({
					line: index + 1, // Номер строки в файле
					code: line.trim(), // Сама строка
					pattern: pattern.source, // Регулярное выражение
				});
			}
		});
	});

	return results;
}



module.exports = findUnsafeCalls;
