const fs = require('fs');
const { parentPort, workerData } = require('worker_threads');
const checkForDomains = require('./checks/checkForDomains');
const checkForSQLStatements = require('./checks/checkForSQLStatement');
const checkForSecrets = require('./checks/checkSecrets');

// Имитация анализа Java-файла
function AnalyzeJavaFile(javaCode, filePath, sensetivityLevel, entropyLevel) {
	const domainResult = checkForDomains(javaCode);
	const SQLResult = checkForSQLStatements(javaCode);
	const SecretsResult = checkForSecrets(javaCode, sensetivityLevel, entropyLevel);
	// console.log(SQLResult);
	return {
		fileName: filePath,
		codeLength: javaCode.length,
		analyzed: true,
		domainResult: domainResult,
		SQLResult,
		SecretsResult
	};
}

try {
	const {file, entropyLevel, sensitivityLevel} = workerData;
	const content = fs.readFileSync(file, 'utf8'); // Читаем содержимое файла
	const analysisResult = AnalyzeJavaFile(content, file, sensitivityLevel, entropyLevel); // Анализируем файл
	parentPort?.postMessage({ success: true, file: file, result: analysisResult }); // Возвращаем результат
} catch (error) {
	console.error('Error in worker!', error);
	parentPort?.postMessage({ success: false, file: workerData, error: error.message }); // Сообщаем об ошибке
}
