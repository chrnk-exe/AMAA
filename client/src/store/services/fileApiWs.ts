import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import socket from '../../socket';

export const fileApiWs = createApi({
	reducerPath: 'fileApiWs',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
	}),
	endpoints: build => ({
		getDirectories: build.mutation<string, string>({
			queryFn: (path) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('listDirectories', path);
						resolve({data: 'listDirectories message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		getFile: build.mutation<string, string>({
			queryFn: (path) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('fileContent', path);
						resolve({data: 'fileContent message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		deleteFile: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('spawn');
						resolve({data: 'spawn message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		deleteDirectory: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('spawn');
						resolve({data: 'spawn message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		createFile: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('spawn');
						resolve({data: 'spawn message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		createDirectory: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('spawn');
						resolve({data: 'spawn message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		modifyFile: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('spawn');
						resolve({data: 'spawn message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		})
	})
});

export const {
	useGetDirectoriesMutation,
	useGetFileMutation,
	useModifyFileMutation,
	useDeleteFileMutation,
	useDeleteDirectoryMutation,
	useCreateFileMutation,
	useCreateDirectoryMutation
} = fileApiWs;
