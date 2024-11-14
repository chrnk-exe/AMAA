import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import exp from 'node:constants';

function getSignatureVersions(pathToApk) {
	let v1 = false, v2 = false, v3 = false, v4 = false;

	try {
		const apksigner = 'C:\\Users\\i.kotov\\Desktop\\my_projects\\study_research\\work\\server\\src\\static-analyze\\tools\\apksigner.jar';
		const args = ['java', '-Xmx1024M', '-jar', apksigner, 'verify', '--verbose', pathToApk];

		console.log(args.join(' '))
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

console.log(getSignatureVersions('C:\\Users\\i.kotov\\Desktop\\my_projects\\study_research\\work\\server\\src\\static-analyze\\apks\\prod_app_bspb_b2c_android_c073c6d24f.apk'))

export default  getSignatureVersions;