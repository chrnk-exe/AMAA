import { Database } from 'sqlite';

export async function deleteSecretFound(
	db: Database,
	secretId: number
): Promise<void> {
	await db.run(
		`
      DELETE FROM secrets_found WHERE id = ?;
    `,
		[secretId]
	);
}
