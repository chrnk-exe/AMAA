import { Script } from 'frida';
import { dbQuery } from '../globalUtils/filesOverFridaUtils/dbQuery';
import { checkSecretsStr } from './checkSecretsStr';
import checkSecretsJson from '../static-analyze/checks/checkSecrets';

const SQLAnalyzeQueries = {
	getTables: () => 'SELECT name FROM sqlite_master WHERE type=\'table\';',
	getColumns: (tableName: string) => `PRAGMA table_info(${tableName});`,
	getInfoFromColumn: (tableName: string, columnName: string) => `SELECT ${columnName} FROM ${tableName};`
};


export default async function (script: Script, path: string): Promise<secretResult[]>  {
	const response = await dbQuery(path, SQLAnalyzeQueries.getTables(), script);
	const tableNames = response.slice(1).map(item => item[0]);

	const foundSecrets: secretResult[] = [];

	for (const table of tableNames) {
		const columns = await dbQuery(path, SQLAnalyzeQueries.getColumns(table), script);
		const columnNames = columns.slice(1).map(row => row[1]);
		for (const columnName of columnNames) {
			const info = await dbQuery(path, SQLAnalyzeQueries.getInfoFromColumn(table, columnName), script);
			const columnValues = info.map(infoItem => infoItem[0]);
			for (const columnValue of columnValues) {
				if(columnValue.length < 5) continue;
				if(columnValue.length > 100) {
					// checkSecretsJson - JS Function без возможности типизации
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					foundSecrets.concat(checkSecretsJson(columnValue, 4.5, 3, false));
				} else {
					foundSecrets.concat(checkSecretsStr(columnValue, 4.5));
				}
			}
			// console.log(table, columnName, columnValues);
		}
	}

	return foundSecrets;
}