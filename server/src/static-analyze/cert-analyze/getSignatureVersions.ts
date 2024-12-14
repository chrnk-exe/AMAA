import * as path from 'path';
import { execSync } from 'child_process';

function getSignatureVersions(pathToApk: string): [boolean, boolean, boolean, boolean] {
	let v1 = false, v2 = false, v3 = false, v4 = false;
	let v1error = false, v2error = false, v3error = false, v4error = false;
	let error: string | null = null; // Переменная для хранения сообщения об ошибке

	try {
		const apksigner = path.join(__dirname, '../tools', 'apksigner.jar');
		const args = ['java', '-Xmx1024M', '-jar', apksigner, 'verify', '--verbose', pathToApk];
		const out = execSync(args.join(' '), { stdio: 'pipe' }).toString('utf-8');

		// Проверка на ошибки в выводе, например, "DOES NOT VERIFY"
		if (out.includes('DOES NOT VERIFY')) {
			error = 'APK signature does not verify.';
		} else {
			// Проверка на различные схемы подписи
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

			// Проверка на ошибки в случае, если схемы подписи отсутствуют
			if (out.match(/ERROR: JAR signer.* indicates the APK is signed using APK Signature Scheme v2 but no such signature was found/)) {
				v2error = true;
			} else if (out.match(/ERROR: JAR signer.* indicates the APK is signed using APK Signature Scheme v3 but no such signature was found/)) {
				v3error = true;
			} else if (out.match(/ERROR: JAR signer.* indicates the APK is signed using APK Signature Scheme v4 but no such signature was found/)) {
				v4error = true;
			} else if (out.match(/ERROR: JAR signer.* indicates the APK is signed using APK Signature Scheme v1 but no such signature was found/)) {
				v1error = true;
			}
		}
	} catch (exp) {
		const msg = 'Failed to get signature versions with apksigner';
		console.error(msg);
	}

	// Возвращаем информацию о версиях подписи и сообщение об ошибке (если оно есть)
	return [v1 || v1error, v2 || v2error, v3 || v3error, v4 || v4error];
}

export default getSignatureVersions;
