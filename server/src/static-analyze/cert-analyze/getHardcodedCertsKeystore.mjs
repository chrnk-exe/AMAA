const fs = require('fs');
const path = require('path');

/**
 * Returns the hardcoded certificate keystore.
 * @param {string[]} files - List of file paths in the APK.
 * @returns {Array} List of findings with hardcoded certificates or keystores.
 */
function getHardcodedCertKeystore(files) {
	try {
		console.info('Getting Hardcoded Certificates/Keystores');
		appendScanStatus(checksum, 'Getting Hardcoded Certificates/Keystores');

		const findings = [];
		const certz = [];
		const keyStore = [];

		files.forEach(fileName => {
			// Проверяем наличие расширения в имени файла
			const ext = path.extname(fileName).toLowerCase();

			// Проверяем, является ли файл сертификатом
			if (['.cer', '.pem', '.cert', '.crt', '.pub', '.key', '.pfx', '.p12', '.der'].includes(ext)) {
				certz.push(escapeHtml(fileName));
			}
			// Проверяем, является ли файл хранилищем ключей
			if (['.jks', '.bks'].includes(ext)) {
				keyStore.push(escapeHtml(fileName));
			}
		});

		// Если найдены сертификаты, добавляем их в отчёт
		if (certz.length > 0) {
			findings.push({
				finding: 'Certificate/Key files hardcoded inside the app.',
				files: certz
			});
		}

		// Если найдены хранилища ключей, добавляем их в отчёт
		if (keyStore.length > 0) {
			findings.push({
				finding: 'Hardcoded Keystore found.',
				files: keyStore
			});
		}

		return findings;

	} catch (error) {
		console.error('Error getting hardcoded certificates/keystores:', error);
	}
}

// Пример вспомогательной функции для экранирования HTML
function escapeHtml(text) {
	return text.replace(/[&<>"'`=\/]/g, function (s) {
		return ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'`': '&#96;',
			'=': '&#61;',
			'/': '&#47;'
		})[s];
	});
}

