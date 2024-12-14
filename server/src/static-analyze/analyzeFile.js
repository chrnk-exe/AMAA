const fs = require('fs');
const { parentPort, workerData } = require('worker_threads');
const checkForDomains = require('./checks/checkForDomains');
const checkForSQLStatements = require('./checks/checkForSQLStatement');
const checkForSecrets = require('./checks/checkSecrets');
const checkForUnsafeMethods = require('./checks/checkForUnsafeMethods');
const checkForWeakCrypto = require('./checks/checkForWeakCrypto');

// Имитация анализа Java-файла
function AnalyzeJavaFile(javaCode, filePath, entropyLevel, includeHighEntropy, includeKeywords, includeRegexes, includeAllStrings) {
	const domainResult = checkForDomains(javaCode);
	const SQLResult = checkForSQLStatements(javaCode);
	const SecretsResult = checkForSecrets(javaCode, entropyLevel, includeHighEntropy, includeKeywords, includeRegexes, includeAllStrings);
	const unsafeMethods = checkForUnsafeMethods(javaCode);
	const weakCrypto = checkForWeakCrypto(javaCode);

	// console.log(SQLResult);
	return {
		fileName: filePath,
		codeLength: javaCode.length,
		analyzed: true,
		domainResult: domainResult,
		SQLResult,
		SecretsResult,
		unsafeMethods,
		weakCrypto
	};
}

try {
	const {file, entropyLevel, includeHighEntropy, includeKeywords, includeRegexes, includeAllStrings} = workerData;
	console.log(`Analyzing ${file}`);
	const content = fs.readFileSync(file, 'utf8'); // Читаем содержимое файла
	const analysisResult = AnalyzeJavaFile(content, file, entropyLevel, includeHighEntropy, includeKeywords, includeRegexes, includeAllStrings); // Анализируем файл
	parentPort?.postMessage({ success: true, file: file, result: analysisResult }); // Возвращаем результат
} catch (error) {
	console.error('Error in worker!', error);
	parentPort?.postMessage({ success: false, file: workerData, error: error.message }); // Сообщаем об ошибке
}
