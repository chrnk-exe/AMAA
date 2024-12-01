import { Database } from 'sqlite';

export async function createStaticResult(
	db: Database,
	scanId: number,
	certVersion: string,
	hardcodedCert: string | null,
	dangerousPermissions: string | null,
	minSdk: number | null,
	maxSdk: number | null,
	criticalAttributes: number
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO static_results (
        scan_id, cert_version, hardcoded_cert, dangerous_permissions, 
        min_sdk, max_sdk, critical_attributes
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
		[scanId, certVersion, hardcodedCert, dangerousPermissions, minSdk, maxSdk, criticalAttributes]
	);

	return result.lastID as number; // Возвращаем ID записи
}
