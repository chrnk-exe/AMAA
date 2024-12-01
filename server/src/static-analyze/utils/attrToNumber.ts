export default function attributesToNumber(attributes: CriticalAttributes): number {
	let result = 0;
	if (attributes.debuggable) result |= 1; // Устанавливаем 1-й бит
	if (attributes.allowBackup) result |= 2; // Устанавливаем 2-й бит
	if (attributes.usesCleartextTraffic) result |= 4; // Устанавливаем 3-й бит
	return result;
}
