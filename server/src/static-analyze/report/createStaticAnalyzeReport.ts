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


	const reportData = {
		title: `Security Scan Report for Scan ID: ${scanId}`,
		date: new Date().toLocaleString(),
		summary: `This report contains the results of the security scan (ID: ${scanId}). Below are the detected issues and their details.`,
		appName,
		packageName,
		scanType,
		details: [
			{
				section: 'Intent Filters',
				content: intentFilters.map(
					(filter) =>
						`Path Patterns: ${filter.pathPatterns || 'N/A'}, Hosts: ${
							filter.hosts || 'N/A'
						}, Schemes: ${filter.schemes || 'N/A'}`
				),
			},
			{
				section: 'Weak Crypto Method / Algorithm',
				content: weakCrypto.map(
					(crypto) =>
						`Method: ${crypto.method}, File Path: ${crypto.filePath}`
				),
			},
			{
				section: 'Unsafe Methods',
				content: unsafeMethods.map(
					(method) =>
						`Method: ${method.method}, File Path: ${method.filePath}`
				),
			},
			{
				section: 'Found Secrets',
				content: secrets.map(
					(secret) =>
						`String: ${secret.string}, Type: ${secret.stringType}, Entropy: ${
							secret.entropy || 'N/A'
						}, File Path: ${secret.filePath}`
				),
			},
			{
				section: 'Possible SQL Injection',
				content: possibleSQLInjection.map(
					(sql) =>
						`Expression: ${sql.expression}, File Path: ${sql.filePath}`
				),
			},
			{
				section: 'Exported Components',
				content: exportedComponents.map(
					(component) =>
						`Category: ${component.category}, Name: ${component.name}`
				),
			},
			{
				section: 'Domains Found',
				content: domains.map(
					(domain) =>
						`Domain: ${domain.domain}, File Path: ${domain.filePath}`
				),
			},
			{
				section: 'Hardcoded Certificates or Keystores',
				content: hardcodedCerts.map(
					(cert) =>
						`Type: ${cert.type}, File Path: ${cert.filePath}`
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