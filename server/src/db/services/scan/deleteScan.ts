import { Database } from 'sqlite';

export async function deleteScan(db: Database, scanId: number): Promise<void> {
	await db.run(
		`
      DELETE FROM scans WHERE id = ?;
    `,
		[scanId]
	);
}
