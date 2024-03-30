export default function generateFilename(path: string | undefined, filename: string) {
	if (path) {
		return path[path.length - 1] !== '/' ? path + '/' + filename : path + filename;
	} else {
		return filename[0] === '/' ? filename : `/${filename}`;
	}
}