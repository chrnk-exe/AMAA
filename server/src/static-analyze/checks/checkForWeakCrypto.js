const weakAlgorithms = [
	// MD5
	{ name: 'MD5', regex: /\bMD5\b|\bMessageDigest.getInstance\s*\(\s*"MD5"\s*\)/g },
	// RC4
	{ name: 'RC4', regex: /\bRC4\b|\bCipher.getInstance\s*\(\s*"RC4"\s*\)/g },
	// SHA-1
	{ name: 'SHA-1', regex: /\bSHA-1\b|\bMessageDigest.getInstance\s*\(\s*"SHA-1"\s*\)/g },
	// DES
	{ name: 'DES', regex: /\bDES\b|\bCipher.getInstance\s*\(\s*"DES"\s*\)/g },
	// Triple DES (3DES)
	{ name: 'Triple DES', regex: /\bDESede\b|\bCipher.getInstance\s*\(\s*"DESede"\s*\)/g },
	// AES with ECB mode (AES is secure, but ECB is not)
	{ name: 'AES with ECB mode', regex: /\bAES\b.*\bECB\b|\bCipher.getInstance\s*\(\s*"AES\/ECB\/[A-Za-z0-9\/]+\s*\)/g }
];

module.exports = function findWeakCrypto(code) {
	const results = [];

	weakAlgorithms.forEach(({ name, regex }) => {
		const matches = code.match(regex);
		if (matches) {
			results.push({ algorithm: name, occurrences: matches.length, matches });
		}
	});

	return results;
};