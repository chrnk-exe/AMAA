import { Database } from 'sqlite';

export async function createSecretFound(
	db: Database,
	dynamicResultId: number,
	filePath: string,
	string: string,
	stringType: 'string' | 'high_entropy' | 'regex' | 'sus_word',
	entropy?: number
): Promise<void> {
	await db.run(
		`
    INSERT INTO secrets_found (dynamic_result_id, file_path, string, string_type, entropy)
    VALUES (?, ?, ?, ?, ?);
    `,
		[dynamicResultId, filePath, string, stringType, entropy ?? null]
	);
}
