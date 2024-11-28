import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import streamSaver from 'streamsaver';

const baseUrl = 'http://localhost:31337/api/package/';

export const javaFilesApi = createApi({
	reducerPath: 'javaFilesApi',
	baseQuery: fetchBaseQuery({
		baseUrl,
		credentials: 'include'
	}),
	endpoints: (build) => ({
		isFile: build.mutation<RpcResponseJavaTyped<IsFileResponseJava>, {identifier: string, path: string}>({
			query: ({ identifier, path }) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'isFile',
					args: [path]
				}
			})
		}),
		ls: build.mutation<RpcResponseJavaTyped<LsResponseJava>, {identifier: string, path: string}>({
			query: ({identifier, path}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'ls',
					args: [path]
				}
			})
		}),
		getPackageInfo: build.mutation<RpcResponseJavaTyped<PackageInfoResponseJava>, {identifier: string}>({
			query: ({identifier}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'getPackageInfo'
				}
			})
		}),
		dbQuery: build.mutation<RpcResponseJavaTyped<DbQueryResponseJava>, {identifier: string, dbFile: string, dbQuery: string}>({
			query: ({identifier, dbFile, dbQuery}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'dbQuery',
					args: [dbFile, dbQuery]
				}
			})
		}),
		fileExists: build.mutation<RpcResponseJavaTyped<FileExistsResponseJava>, {identifier: string, path: string}>({
			query: ({identifier, path}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'fileExists',
					args: [path]
				}
			})
		}),
		readFile: build.mutation<RpcResponseJavaTyped<ReadFileResponseJava>, {identifier: string, path: string, size: number, offset?: number}>({
			query: ({identifier, path, size, offset}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'readFile',
					args: [path, size, offset]
				}
			})
		}),
		editFile: build.mutation<RpcResponseJavaTyped<ReadFileResponseJava>, {identifier: string, path: string, newContent: string}>({
			query: ({identifier, path, newContent}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'editFile',
					args: [path, newContent]
				}
			})
		}),
		downloadFile: build.mutation<undefined, {identifier: string, path: string, size: number}>({
			async queryFn({identifier, path, size}) {
				try {
					// Отправка запроса на сервер
					const response = await fetch(`${baseUrl}${identifier}/download`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ path, size }),
						credentials: 'include'
					});

					if (!response.ok) {
						return { error: undefined, data: undefined };
					}

					// Получаем имя файла из заголовка Content-Disposition
					const contentDisposition = response.headers.get('Content-Disposition');
					let filename = path.split('/')[path.split('/').length - 1];
					if (contentDisposition && contentDisposition.includes('filename=')) {
						filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
					}

					// Создаем поток для записи данных в файл
					const writableStream = streamSaver.createWriteStream(filename);
					const writer = writableStream.getWriter();

					// Чтение данных с помощью Reader
					if (response.body){
						const reader = response.body.getReader();
						const pump = () =>
							reader.read().then(({ done, value }) => {
								if (done) {
									writer.close();
									return;
								}
								writer.write(value);
								pump();
							});

						pump(); // Запускаем потоковую передачу
						return { data: undefined }; // Просто возвращаем пустой результат, так как файл уже загружается
					} else {
						return { error: undefined, data: undefined };
					}
				} catch (error) {
					console.error('Download failed:', error);
					return { error: undefined, data: undefined };
				}
			}
		}),
		downloadDirectory: build.mutation<undefined, {identifier: string, path: string}>({
			async queryFn({identifier, path}) {
				try {
					// Отправка запроса на сервер
					const response = await fetch(`${baseUrl}${identifier}/download-directory`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ path }),
						credentials: 'include'
					});

					if (!response.ok) {
						return { error: undefined, data: undefined };
					}

					// Получаем имя файла из заголовка Content-Disposition
					const contentDisposition = response.headers.get('Content-Disposition');
					const filename = `${path.split('/')[path.split('/').length - 1]}.zip`;

					// Создаем поток для записи данных в файл
					const writableStream = streamSaver.createWriteStream(filename);
					const writer = writableStream.getWriter();

					// Чтение данных с помощью Reader
					if (response.body){
						const reader = response.body.getReader();
						const pump = () =>
							reader.read().then(({ done, value }) => {
								if (done) {
									writer.close();
									return;
								}
								writer.write(value);
								pump();
							});

						pump(); // Запускаем потоковую передачу
						return { data: undefined }; // Просто возвращаем пустой результат, так как файл уже загружается
					} else {
						return { error: undefined, data: undefined };
					}
				} catch (error) {
					console.error('Download failed:', error);
					return { error: undefined, data: undefined };
				}
			}
		})
	}),

});

export const {
	useIsFileMutation,
	useLsMutation,
	useGetPackageInfoMutation,
	useDbQueryMutation,
	useFileExistsMutation,
	useReadFileMutation,
	useEditFileMutation,
	useDownloadDirectoryMutation,
	useDownloadFileMutation
} = javaFilesApi;