import { Database } from 'sqlite';

export async function createDynamicResult(
	db: Database,
	scanId: number,
	sslPinningBypassed: boolean
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO dynamic_results (scan_id, ssl_pinning_bypassed)
      VALUES (?, ?);
    `,
		[scanId, sslPinningBypassed]
	);

	return result.lastID as number; // Возвращаем ID нового результата динамического анализа
}
