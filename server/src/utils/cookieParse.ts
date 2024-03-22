
function cookieParse(cookieHeader: string) {
	const cookiesStrings = cookieHeader.split(';');
	const result: Record<string, string | number> = {};
	cookiesStrings.map(cookieStr => {
		const value = cookieStr.split('=')[1].trim();
		result[cookieStr.split('=')[0].trim()] = Number.isNaN(Number(value)) ? value : Number(value);

	});
	return result;
}

export default cookieParse;

