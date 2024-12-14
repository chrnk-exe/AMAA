export function generateHTMLReport(reportData: ReportData): string {
	const { title, date, summary, appName, packageName, scanType, details } = reportData;

	let html = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${title}</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 0;
				padding: 20px;
				background-color: #f4f4f9;
				color: #333;
			}
			h1, h2, h3 {
				color: #444;
			}
			.header {
				padding: 10px 20px;
				background-color: #005f73;
				color: #fff;
				margin-bottom: 20px;
			}
			.section {
				margin-bottom: 40px;
			}
			.table-container {
				overflow-x: auto;
			}
			table {
				width: 100%;
				border-collapse: collapse;
				margin-top: 10px;
				background-color: #fff;
			}
			th, td {
				padding: 10px;
				text-align: left;
				border: 1px solid #ddd;
			}
			th {
				background-color: #e0e1dd;
			}
			.no-data {
				color: #888;
				font-style: italic;
			}
		</style>
	</head>
	<body>
		<div class="header">
			<h1>${title}</h1>
			<p>${summary}</p>
			<p><strong>Дата:</strong> ${date}</p>
			<p><strong>Название приложения/путь до файла:</strong> ${appName}</p>
			<p><strong>Название пакета:</strong> ${packageName}</p>
			<p><strong>Тип сканирования:</strong> ${scanType}</p>
		</div>
	`;

	// Генерация секций
	for (const detail of details) {
		html += `
		<div class="section">
			<h2>${detail.section}</h2>
			${detail.content.length > 0 ? `
			<div class="table-container">
				<table>
					<tr><th>Детали</th></tr>
					${detail.content.map(item => `<tr><td>${item}</td></tr>`).join('')}
				</table>
			</div>` : '<p class="no-data">No data found</p>'}
		</div>
		`;
	}

	html += `
	</body>
	</html>
	`;

	return html;
}
