import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const javaFilesApi = createApi({
	reducerPath: 'javaFilesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/package/',
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
		readFile: build.mutation<RpcResponseJavaTyped<ReadFileResponseJava>, {identifier: string, path: string, size: number}>({
			query: ({identifier, path, size}) => ({
				url: `/${identifier}`,
				method: 'POST',
				body: {
					command: 'readFile',
					args: [path, size]
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
	}),

});

export const {
	useIsFileMutation,
	useLsMutation,
	useGetPackageInfoMutation,
	useDbQueryMutation,
	useFileExistsMutation,
	useReadFileMutation,
	useEditFileMutation
} = javaFilesApi;