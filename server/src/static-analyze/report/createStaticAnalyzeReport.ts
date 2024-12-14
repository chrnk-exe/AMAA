import {getWeakCryptoByScanId} from '../../db/services/static/WeakCrypto/getWeakCryptoByScanId';
import {getUnsafeMethodByScanId} from '../../db/services/static/UnsafeMethod/getUnsafeMethodByScanId';
import {getHighEntropyStringsByScanId} from '../../db/services/static/HighEntropyStrings/getHighEntropyStringsByScanId';
import {getSqlExpressionByScanId} from '../../db/services/static/SQLExpression/getSqlExpressionByScanId';
import {getExportedComponentsByScanId} from '../../db/services/static/exportedComponent/getExportedComponentByScanId';
import {getDomainsFoundByScanId} from '../../db/services/static/DomainFound/getDomainFoundByScanId';
import {getHardcodedCertByScanId } from '../../db/services/static/hardcodedCerts/getHardcodedCertByScanId';
import { getIntentFiltersByScanId } from '../../db/services/static/IntentFilter/getIntentFiltersByScanId';
import { generateHTMLReport } from './createHtmlReport';
import {db} from '../../db/init';
import fs from 'fs';

import puppeteer from 'puppeteer';
import { getScansByScanId } from '../../db/services/scan/GetScanByScanId';
import path from 'path';

export async function generatePdfFromHtml(htmlPath: string, pdfPath: string): Promise<void> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Загрузка локального HTML-файла
	await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

	// Генерация PDF
	await page.pdf({
		path: pdfPath,
		format: 'A4',
		printBackground: true,
	});

	console.log(`PDF report generated at: ${pdfPath}`);

	await browser.close();
}


export default async function(scanId: number) {
	const { appName, packageName, scanType } = await getScansByScanId(await db, scanId);

	const intentFilters = await getIntentFiltersByScanId(await db, scanId);
	const weakCrypto = await getWeakCryptoByScanId(await db, scanId);
	const unsafeMethods = await getUnsafeMethodByScanId(await db, scanId);
	const secrets = await getHighEntropyStringsByScanId(await db, scanId);
	const possibleSQLInjection = await getSqlExpressionByScanId(await db, scanId);
	const exportedComponents = await getExportedComponentsByScanId(await db, scanId);
	const domains = await getDomainsFoundByScanId(await db, scanId);
	const hardcodedCerts = await getHardcodedCertByScanId(await db, scanId);

	const reportData: ReportData = {
		title: `Результат сканирования для скана с номером: ${scanId}`,
		date: new Date().toLocaleString(),
		summary: `Этот отчет содержит результаты сканирования безопасности  (ID: ${scanId}). Ниже приведены обнаруженные проблемы и их подробности.`,
		appName,
		packageName,
		scanType,
		details: [
			{
				section: 'Интент-фильтры',
				content: intentFilters.map((filter) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Шаблоны путей</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${filter.pathPatterns || 'N/A'}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Упоминаемые хосты</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${filter.hosts || 'N/A'}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Используемые схемы</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${filter.schemes || 'N/A'}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Использование слабого криптографического алгоритма (OWASP M8, M10)',
				content: weakCrypto.map((crypto) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Метод</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${crypto.method}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${crypto.filePath}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Использование небезопасных методов/функций (OWASP M8, M9)',
				content: unsafeMethods.map((method) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Метод</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${method.method}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${method.filePath}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Секреты, содержащиеся в коде APK или файлах приложения (OWASP M1, M3, M8)',
				content: secrets.map((secret) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Подозрительная строка</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.string}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Тип поиска</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.stringType === 'sus_word' ? 'keyword': secret.stringType}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.filePath || 'N/A'}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Энтропия</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.entropy || 'N/A'}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Возможная SQL-инъекция OWASP (M4, M8)',
				content: possibleSQLInjection.map((sql) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Выражение</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${sql.expression}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${sql.filePath}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Экспортируемые компоненты (OWASP M1)',
				content: exportedComponents.map((component) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Категория</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${component.category}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Имя</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${component.name}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Используемые домены (OWASP M1)',
				content: domains.map((domain) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Домен</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${domain.domain}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${domain.filePath}</td></tr>
                    </table>`
				),
			},
			{
				section: 'Жестко запрограммированные сертификаты или хранилища ключей (OWASP M1, M8, M10)',
				content: hardcodedCerts.map((cert) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Тип</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${cert.type}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${cert.filePath}</td></tr>
                    </table>`
				),
			},
		],
	};


	const reportFolderPath = path.join(__dirname, 'reports');

	if (!fs.existsSync(reportFolderPath)) {
		fs.mkdirSync(reportFolderPath, { recursive: true });
	}

	const htmlContent = generateHTMLReport(reportData);
	const htmlPath = path.join(reportFolderPath, 'report.html');
	fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

	const pdfPath = path.join(reportFolderPath, 'report.pdf');
	await generatePdfFromHtml(htmlPath, pdfPath);

	return pdfPath;
}
