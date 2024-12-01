import { createExportedComponent } from '../../db/services/static/exportedComponent/createExportedComponent';
import { createIntentFilter } from '../../db/services/static/IntentFilter/createIntentFilter';
import { createHardcodedCert } from '../../db/services/static/hardcodedCerts/createHardcodedCert';
import certFindings from './findingTypes';
// import { hardcodedCertType } from '../../db/init';
import { Database } from 'sqlite';


export default function(
	db: Database,
	staticResultId: number,
	hardcodedCerts: {finding: certFindings, files: string[]}[],
	exportedEntities: ExportedEntity[],
	intentFilters: IntentFilterData
) {

	// append certs
	for (const hardcodedCert of hardcodedCerts) {
		for (const hardcodedFilename of hardcodedCert.files) {
			createHardcodedCert(db, staticResultId, hardcodedCert.finding, hardcodedFilename);
		}
	}

	// append exportedComponents
	for (const exportedEntity of exportedEntities){
		createExportedComponent(db, staticResultId, exportedEntity.category, exportedEntity.name);
	}

	// append intents
	createIntentFilter(
		db,
		staticResultId,
		JSON.stringify(intentFilters.pathPatterns),
		JSON.stringify(intentFilters.pathPrefixes),
		JSON.stringify(intentFilters.paths),
		JSON.stringify(intentFilters.schemes),
		JSON.stringify(intentFilters.hosts),
	);
}