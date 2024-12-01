import { Database } from 'sqlite';

export async function createSqlExpression(
	db: Database,
	staticResultId: number,
	expression: string,
	filePath: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO sql_expressions (static_result_id, expression, file_path)
      VALUES (?, ?, ?);
    `,
		[staticResultId, expression, filePath]
	);

	return result.lastID as number; // Возвращаем ID SQL-выражения
}
