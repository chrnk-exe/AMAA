import { Database } from 'sqlite';

export async function updateCurrentStep(
	db: Database,
	scanId: number,
	currentStep: string
): Promise<void> {
	await db.run(
		`
      UPDATE scans
      SET current_step = ?
      WHERE id = ?;
    `,
		[currentStep, scanId]
	);
}
