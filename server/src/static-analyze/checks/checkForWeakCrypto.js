const weakAlgorithms = [
	// MD5
	{ name: 'MD5', regex: /\bMD5\b|\bMessageDigest.getInstance\s*\(\s*"MD5"\s*\)/g },
	// RC4
	{ name: 'RC4', regex: /\bRC4\b|\bCipher.getInstance\s*\(\s*"RC4"\s*\)/g },
	// SHA-1
	{ name: 'SHA-1', regex: /\bSHA-1\b|\bMessageDigest.getInstance\s*\(\s*"SHA-1"\s*\)/g },
	// HmacSHA1
	{ name: 'HmacSHA1', regex: /\bHmacSHA1\b|\bMac.getInstance\s*\(\s*"HmacSHA1"\s*\)/g },
	// DES
	{ name: 'DES', regex: /\bDES\b|\bCipher.getInstance\s*\(\s*"DES"\s*\)/g },
	// Triple DES (3DES)
	{ name: 'Triple DES', regex: /\bDESede\b|\bCipher.getInstance\s*\(\s*"DESede"\s*\)/g },
	// AES with ECB mode
	{ name: 'AES with ECB mode', regex: /\bAES\b.*\bECB\b|\bCipher.getInstance\s*\(\s*"AES\/ECB\/[A-Za-z0-9\/]+\s*\)/g },
	// RSA with short keys (<2048 bits)
	{ name: 'RSA with short keys', regex: /\bRSA\b|\bKeyPairGenerator.getInstance\s*\(\s*"RSA"\s*\).*\.initialize\s*\(\s*\d{1,3}\s*\)/g },
	// PBE with MD5 and DES
	{ name: 'PBEWithMD5AndDES', regex: /\bPBEWithMD5AndDES\b|\bCipher.getInstance\s*\(\s*"PBEWithMD5AndDES"\s*\)/g },
	// SSL/TLS protocols (SSLv3, TLS 1.0, TLS 1.1)
	{ name: 'Insecure SSL/TLS protocol', regex: /\bSSLv3\b|\bTLSv1\.0\b|\bTLSv1\.1\b/g }
];


module.exports = function findWeakCrypto(code) {
	const results = [];
	const lines = code.split('\n'); // Разбиваем код на строки

	lines.forEach((line, index) => {
		weakAlgorithms.forEach(({ name, regex }) => {
			if (regex.test(line)) { // Проверяем каждую строку на совпадение
				results.push({
					algorithm: name,
					line: index + 1, // Номер строки
					code: line.trim(), // Содержимое строки
				});
			}
		});
	});

	return results;
};
