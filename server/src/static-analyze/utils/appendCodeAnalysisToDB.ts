
import { Database } from 'sqlite';
import { createDomainFound } from '../../db/services/static/DomainFound/createDomainFound';
import { createSqlExpression } from '../../db/services/static/SQLExpression/createSQLExpression';
import { createHighEntropyString } from '../../db/services/static/HighEntropyStrings/createHighEntropyString';
import { createUnsafeMethod } from '../../db/services/static/UnsafeMethod/createUnsafeMethod';
import { createWeakCrypto } from '../../db/services/static/WeakCrypto/createWeakCrypto';


export default async function(
	db: Database,
	staticResultId: number,
	codeAuditResults: Record<string, CodeAuditResult>
) {
	Object.values(codeAuditResults).forEach(CodeAuditResult => {
		const {fileName, domainResult, SQLResult, SecretsResult, unsafeMethods, weakCrypto} = CodeAuditResult;
		const resultFilename = fileName.split('source')[fileName.split('source').length - 1];
		for (const domain of domainResult.domains) {
			createDomainFound(db, staticResultId, domain, resultFilename);
		}
		for (const sqlQuery of SQLResult.sqlQueries) {
			createSqlExpression(db, staticResultId, sqlQuery, resultFilename);
		}
		for (const secret of SecretsResult) {
			createHighEntropyString(db, staticResultId, resultFilename, secret.data, secret.type, secret.value);
		}
		for (const method of unsafeMethods) {
			createUnsafeMethod(db, staticResultId, method.code, resultFilename);
		}
		for (const weakCryptoObject of weakCrypto) {
			createWeakCrypto(db, staticResultId, weakCryptoObject.code, resultFilename);
		}

	});
}