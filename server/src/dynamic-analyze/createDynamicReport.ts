import { getSecretsFoundByScanId } from '../db/services/dynamic/getFoundSecretsByScanId';
import {db} from '../db/init';
import fs from 'fs';
import puppeteer from 'puppeteer';
import {generateHTMLReport} from '../static-analyze/report/createHtmlReport';
import { getScansByScanId } from '../db/services/scan/GetScanByScanId';
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

	const secrets = await getSecretsFoundByScanId(await db, scanId);


	const reportData = {
		title: `Результат сканирования для скана с номером: ${scanId}`,
		date: new Date().toLocaleString(),
		summary: `Этот отчет содержит результаты сканирования безопасности  (ID: ${scanId}). Ниже приведены обнаруженные проблемы и их подробности.`,
		appName,
		packageName,
		scanType,
		details: [
			{
				section: 'Найденные секреты в файлах приложения',
				content: secrets.map((secret) =>
					`<table style="width: 100%; table-layout: fixed; border: 1px solid #ddd; border-collapse: collapse;">
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Подозрительная строка</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.string}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Тип поиска</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.stringType === 'sus_word' ? 'keyword': secret.stringType}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Путь до файла</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.filePath || 'N/A'}</td></tr>
                        <tr><th style="width: 25%; padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">Энтропия</th><td style="padding: 8px; border: 1px solid #ddd; word-wrap: break-word;">${secret.entropy || 'N/A'}</td></tr>
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