import { Script } from 'frida';
import { dbQuery } from '../globalUtils/filesOverFridaUtils/dbQuery';
import { checkSecretsStr } from './checkSecretsStr';
import checkSecretsJson from '../static-analyze/checks/checkSecrets';

const SQLAnalyzeQueries = {
	getTables: () => 'SELECT name FROM sqlite_master WHERE type=\'table\';',
	getColumns: (tableName: string) => `PRAGMA table_info(${tableName});`,
	getInfoFromColumn: (tableName: string, columnName: string) => `SELECT ${columnName} FROM ${tableName};`
};

// Функция для выполнения запроса с тайм-аутом
// Функция для выполнения запроса с тайм-аутом
async function executeWithTimeout<T>(
	promise: Promise<T>,
	timeoutMs: number,
	timeoutMessage = 'Operation timed out'
): Promise<T> {
	const timeout = new Promise<T>((_, reject) =>
		setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
	);

	return Promise.race([promise, timeout]);
}

const foundSecrets: secretResult[] = [];

export default async function (script: Script, path: string): Promise<secretResult[]> {
	let response;
	try {
		response = await executeWithTimeout(
			dbQuery(path, SQLAnalyzeQueries.getTables(), script),
			1000
		);
	} catch {
		console.log('sorry(');
		return [];
	}

	const tableNames = response.slice(1).map(item => item[0]);
	for (const table of tableNames) {
		let columns;

		try {
			columns = await executeWithTimeout(
				dbQuery(path, SQLAnalyzeQueries.getColumns(table), script),
				1000
			);
		} catch {
			continue;
		}

		const columnNames = columns.slice(1).map(row => row[1]);
		for (const columnName of columnNames) {
			let info;
			try {
				info = await executeWithTimeout(
					dbQuery(path, SQLAnalyzeQueries.getInfoFromColumn(table, columnName), script),
					500
				);
			} catch {
				continue;
			}

			const columnValues = info.map(infoItem => infoItem[0]);
			for (const columnValue of columnValues) {
				if (columnValue.length < 5) continue;

				if (columnValue.length > 100) {
					// Вызываем checkSecretsJson и добавляем найденные секреты в глобальный массив
					const secrets = checkSecretsJson(columnValue, 4.5, 3, false);
					console.log('Result of checkSecretsJson:', secrets);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					foundSecrets.push(...secrets); // Добавляем найденные секреты
				} else {
					// Вызываем checkSecretsStr и добавляем найденные секреты в глобальный массив
					const secrets = checkSecretsStr(columnValue, 4.5);
					console.log('Result of checkSecretsStr:', secrets);
					foundSecrets.push(...secrets); // Добавляем найденные секреты
				}
			}
		}
	}

	console.log(`FoundSecrets on ${path}: `, foundSecrets);
	return foundSecrets;
}