import { Database } from 'sqlite';

export async function updateSslPinningBypass(
	db: Database,
	dynamicResultId: number,
	sslPinningBypassed: boolean
): Promise<void> {
	await db.run(
		`
      UPDATE dynamic_results
      SET ssl_pinning_bypassed = ?
      WHERE id = ?;
    `,
		[sslPinningBypassed, dynamicResultId]
	);
}
