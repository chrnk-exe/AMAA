import { Database } from 'sqlite';

export async function createHighEntropyString(
	db: Database,
	staticResultId: number,
	filePath: string,
	string: string,
	stringType: 'string' | 'high_entropy' | 'regex' | 'sus_word',
	entropy?: number
): Promise<void> {
	await db.run(
		`
    INSERT INTO high_entropy_strings (static_result_id, file_path, string, string_type, entropy)
    VALUES (?, ?, ?, ?, ?);
    `,
		[staticResultId, filePath, string, stringType, entropy ?? null]
	);
}
