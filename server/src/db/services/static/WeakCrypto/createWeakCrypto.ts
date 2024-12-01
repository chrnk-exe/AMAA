import { Database } from 'sqlite';

export async function createWeakCrypto(
	db: Database,
	staticResultId: number,
	method: string,
	filePath: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO weak_crypto (static_result_id, method, file_path)
      VALUES (?, ?, ?);
    `,
		[staticResultId, method, filePath]
	);

	return result.lastID as number; // Возвращаем ID записи о слабой криптографии
}
