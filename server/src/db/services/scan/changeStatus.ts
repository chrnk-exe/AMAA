import { Database } from 'sqlite';

export async function updateScanStatus(
	db: Database,
	scanId: number,
	status: 'in_process' | 'finished' | 'cancelled'
): Promise<void> {
	await db.run(
		`
      UPDATE scans
      SET status = ?
      WHERE id = ?;
    `,
		[status, scanId]
	);
}
