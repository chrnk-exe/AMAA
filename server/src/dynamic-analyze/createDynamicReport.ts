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
		title: `Security Scan Report for Scan ID: ${scanId}`,
		date: new Date().toLocaleString(),
		summary: `This report contains the results of the security scan (ID: ${scanId}). Below are the detected issues and their details.`,
		appName,
		packageName,
		scanType,
		details: [
			{
				section: 'Found Secrets',
				content: secrets.map(
					(secret) =>
						`String: ${secret.string}, Type: ${secret.stringType}, Entropy: ${
							secret.entropy || 'N/A'
						}, File Path: ${secret.filePath}`
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