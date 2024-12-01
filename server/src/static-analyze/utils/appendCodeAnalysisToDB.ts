
import { Database } from 'sqlite';


export default async function(
	db: Database,
	staticResultId: number,
	codeAuditResult: CodeAuditResult
) {
	return codeAuditResult;
}