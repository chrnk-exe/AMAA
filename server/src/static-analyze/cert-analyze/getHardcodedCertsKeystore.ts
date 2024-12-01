import fs from 'fs';
import path from 'path';
import certFindings from '../utils/findingTypes';

/**
 * Returns the hardcoded certificate keystore.
 * @param {string} checksum - Checksum of the APK file.
 * @param {string[]} files - List of file paths in the APK.
 * @returns {Array} List of findings with hardcoded certificates or keystores.
 */
export default function getHardcodedCertKeystore(files: string[]): Array<{ finding: certFindings; files: string[] }> {
	try {
		console.info('Getting Hardcoded Certificates/Keystores');
		const findings: Array<{ finding: certFindings; files: string[] }> = [];
		const certz: string[] = [];
		const keyStore: string[] = [];

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
				finding: certFindings.HardcodedCertOrKey,
				files: certz
			});
		}

		// Если найдены хранилища ключей, добавляем их в отчёт
		if (keyStore.length > 0) {
			findings.push({
				finding: certFindings.HardcodedKeystore,
				files: keyStore
			});
		}

		return findings;

	} catch (error) {
		console.error('Error getting hardcoded certificates/keystores:', error);
		return [];
	}
}

// Пример вспомогательной функции для экранирования HTML
function escapeHtml(text: string): string {
	return text.replace(/[&<>"'`=\/]/g, function (s) {
		return ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'`': '&#96;',
			'=': '&#61;',
			'/': '&#47;'
		} as { [key: string]: string })[s];
	});
}



