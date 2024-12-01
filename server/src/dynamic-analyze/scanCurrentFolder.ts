import {ls} from '../globalUtils/filesOverFridaUtils/ls';
import { Script } from 'frida';
import scanFile from './scanFile';

export default async function scanCurrentFolder(script: Script, path: string) {
	const { files } = await ls(path, script);
	const results: { filename: string; secrets: secretResult[]; }[] = [];
	for(const file of files) {
		if(file.isDirectory) {
			const deepResult = await scanCurrentFolder(script, file.path);
			results.concat(deepResult);
		}
		if(file.isFile) {
			const fileAnalyzeResult = await scanFile(script, file);
			results.concat(fileAnalyzeResult);
		}
	}
	return results;
}