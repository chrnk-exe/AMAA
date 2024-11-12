import BinaryXML from 'binary-xml';
import fs from 'fs';

const manifestAnalyze = (pathToManifest) => {
	const data = fs.readFileSync(pathToManifest);
	const reader = new BinaryXML(data);
	const document = reader.parse();

	console.log(document);
};

export default manifestAnalyze;