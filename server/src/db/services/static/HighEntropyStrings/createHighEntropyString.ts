import { Database } from 'sqlite';

export async function createHighEntropyString(
	db: Database,
	staticResultId: number,
	string: string,
	entropy: number,
	filePath: string
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO high_entropy_strings (static_result_id, string, entropy, file_path)
      VALUES (?, ?, ?, ?);
    `,
		[staticResultId, string, entropy, filePath]
	);

	return result.lastID as number; // Возвращаем ID строки с высокой энтропией
}
