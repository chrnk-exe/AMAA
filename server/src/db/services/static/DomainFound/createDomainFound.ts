import { Database } from 'sqlite';

export async function createDomainFound(
	db: Database,
	staticResultId: number,
	domain: string,
	filePath: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO domains_found (static_result_id, domain, file_path)
      VALUES (?, ?, ?);
    `,
		[staticResultId, domain, filePath]
	);

	return result.lastID as number; // Возвращаем ID найденного домена
}
