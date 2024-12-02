import {ls} from '../globalUtils/filesOverFridaUtils/ls';
import { Script } from 'frida';
import scanFile from './scanFile';

export default async function scanCurrentFolder(script: Script, path: string) {
	const { files } = await ls(path, script);
	const results: { filename: string; secrets: secretResult[]; }[] = [];
	for(const file of files) {
		if(file.isDirectory) {
			console.log(`Going deep...: ${file.path}`);
			const deepResult = await scanCurrentFolder(script, file.path);
			results.push(...deepResult);
		}
		if(file.isFile) {
			// console.log(`Scanning: ${file.path}`);
			const fileAnalyzeResult = await scanFile(script, file);
			results.push(fileAnalyzeResult);
		}
	}
	// console.log(path, results);
	return results;
}