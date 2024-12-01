export default function numberToAttributes(value: number): CriticalAttributes {
	return {
		debuggable: (value & 1) !== 0, // Проверяем 1-й бит
		allowBackup: (value & 2) !== 0, // Проверяем 2-й бит
		usesCleartextTraffic: (value & 4) !== 0 // Проверяем 3-й бит
	};
}
