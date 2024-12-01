import { join } from 'path';
import createFridaSession from '../globalUtils/createFridaSession';
import fs from 'fs';
import { ls } from '../globalUtils/filesOverFridaUtils/ls';
import {getPackageInfo} from '../globalUtils/filesOverFridaUtils/getPackageInfo';
import scanCurrentFolder from './scanCurrentFolder';


const fridaBrowserPath = join(__dirname, '..', 'frida-services', 'fileBrowser.js');

export default async function(packageName: string, deviceId: string) {
	const session = await createFridaSession(packageName, deviceId);
	const scriptContent = fs.readFileSync(fridaBrowserPath, 'utf-8');
	const script = await session.createScript(scriptContent);
	await script.load();
	const packageInfo = await getPackageInfo(script);
	const foldersToScan = [];
	const foundSecrets: { filename: string; secrets: secretResult[]}[] = [];
	for (const directory of packageInfo.directories) {
		const { files } = await ls(directory.path, script);
		const paths: string[] = files
			.map(file => file.path)
			.filter(path => path.includes('base.apk'));
		if (paths.length === 0){
			foldersToScan.push(directory.path);
		}
	}
	for(const folderToScan of foldersToScan) {
		const scanFolderResult = await scanCurrentFolder(script, folderToScan);
		foundSecrets.concat(scanFolderResult);
	}


	return foundSecrets;
}