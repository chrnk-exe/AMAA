import { Database } from 'sqlite';

interface ScanRecord {
	id: number;
	appName: string;
	packageName: string;
	version: string;
	scanType: 'static' | 'dynamic';
	status: 'in_process' | 'finished' | 'cancelled';
	createdAt: string;
	finishedAt: string | null;
	currentStep: string | null;
}

export async function getAllScans(db: Database): Promise<ScanRecord[]> {
	const rows = await db.all<ScanRecord[]>(`
    SELECT 
      id, 
      app_name AS appName, 
      package_name AS packageName, 
      version, 
      scan_type AS scanType, 
      status, 
      created_at AS createdAt, 
      finished_at AS finishedAt, 
      current_step AS currentStep
    FROM scans;
  `);

	return rows;
}
