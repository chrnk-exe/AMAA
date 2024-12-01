import { fridaScriptCommands } from '../../routes/http/filesOverFridaApi';
import { Script } from 'frida';

export const ls = (path: string, script: Script): Promise<LsResponseFrida> => {
	return script.exports[fridaScriptCommands.ls](...([path] || []));
};

