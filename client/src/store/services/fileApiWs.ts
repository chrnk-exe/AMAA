import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import socket from '../../utils/socket';

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
		deleteFile: build.mutation<string, string>({
			queryFn: (filename) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('deleteFile', filename);
						resolve({data: 'deleteFile message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		deleteDirectory: build.mutation<string, string>({
			queryFn: (dirname) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('deleteDirectory', dirname);
						resolve({data: 'deleteDirectory message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		createFile: build.mutation<string, string>({
			queryFn: (newFilename) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('touchFile', newFilename);
						resolve({data: 'touchFile message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		createDirectory: build.mutation<string, string>({
			queryFn: (newDirname) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('makeDirectory', newDirname);
						resolve({data: 'makeDirectory message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		modifyFile: build.mutation<string, { filename: string, newData: string }>({
			queryFn: ({filename, newData}) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('modifyFile', {filename, data: newData});
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
