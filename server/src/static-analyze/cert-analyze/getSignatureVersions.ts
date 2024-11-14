import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import exp from 'node:constants';

function getSignatureVersions(pathToApk: string): [boolean, boolean, boolean, boolean] {
	let v1 = false, v2 = false, v3 = false, v4 = false;

	try {
		const apksigner = path.join(__dirname, '../tools' ,'apksigner.jar');
		const args = ['java', '-Xmx1024M', '-Djava.library.path=', '-jar', apksigner, 'verify', '--verbose', pathToApk];

		const out = execSync(args.join(' '), { stdio: 'pipe' }).toString('utf-8');

		if (out.match(/v1 scheme \(JAR signing\): true/)) {
			v1 = true;
		}
		if (out.match(/\(APK Signature Scheme v2\): true/)) {
			v2 = true;
		}
		if (out.match(/\(APK Signature Scheme v3\): true/)) {
			v3 = true;
		}
		if (out.match(/\(APK Signature Scheme v4\): true/)) {
			v4 = true;
		}
	} catch (exp) {
		const msg = 'Failed to get signature versions with apksigner';
		console.error(msg);
	}
	return [v1, v2, v3, v4];
}

export default  getSignatureVersions;