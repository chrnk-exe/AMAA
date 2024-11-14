import getHardcodedCertKeystore from './getHardcodedCertsKeystore';
import getSignatureVersions from './getSignatureVersions';


// захардкоженные нужно посмотреть во время просто просмотра файлов, а пока анализируем версию подписи
export default function certAnalyze(pathToApk: string) {
	const result = getSignatureVersions(pathToApk);
	return result;
}
