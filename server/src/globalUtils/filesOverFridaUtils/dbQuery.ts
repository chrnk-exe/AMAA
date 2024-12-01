import { fridaScriptCommands } from '../../routes/http/filesOverFridaApi';
import { Script } from 'frida';

export const dbQuery = (path: string, dbQuery: string, script: Script): Promise<Array<Array<string>>> => {
	return script.exports[fridaScriptCommands.dbQuery](...([path, dbQuery] || []));
};

