import { Database } from 'sqlite';

export async function createScan(
	db: Database,
	appName: string,
	packageName: string,
	version: string,
	scanType: 'static' | 'dynamic'
): Promise<number> {
	const status = 'in_process';
	const currentStep = 'initializing';

	const result = await db.run(
		`
      INSERT INTO scans (app_name, package_name, version, scan_type, status, current_step)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
		[appName, packageName, version, scanType, status, currentStep]
	);

	return result.lastID as number; // Возвращаем ID созданного скана
}
