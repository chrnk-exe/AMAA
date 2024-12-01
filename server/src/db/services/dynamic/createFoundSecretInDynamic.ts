import { Database } from 'sqlite';

export async function createSecretFound(
	db: Database,
	dynamicResultId: number,
	filePath: string,
	secret: string,
	comment?: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO secrets_found (dynamic_results, file_path, secret, comment)
      VALUES (?, ?, ?, ?);
    `,
		[dynamicResultId, filePath, secret, comment || null]
	);

	return result.lastID as number; // Возвращаем ID записи о найденном секрете
}
