import { Database } from 'sqlite';

export async function createExportedComponent(
	db: Database,
	staticResultId: number,
	category: string,
	name: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO exported_components (static_result_id, category, name)
      VALUES (?, ?, ?);
    `,
		[staticResultId, category, name]
	);

	return result.lastID as number; // Возвращаем ID нового компонента
}
