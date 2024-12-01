import { fridaScriptCommands } from '../../routes/http/filesOverFridaApi';
import { Script } from 'frida';

export const getPackageInfo = (script: Script): Promise<PackageInfoResponseJava> => {
	return script.exports[fridaScriptCommands.getPackageInfo](...([]));
};

