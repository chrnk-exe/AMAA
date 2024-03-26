import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { io } from 'socket.io-client';

import socket from '../../socket';

// spawn - создание шелла
// shells - запрос шеллов в shellsList
// command - выполнение команды, ответ приходит в commandResult
// Request:
//
// {"pid": 1,"cmd": "id"}
// Response (может быть несколько, в зависимости от вывода):
//
// {"pid": 1,"commandOutput": "uid=0(root)..."}
// kill - удаление шелла, указывается его pid (идентфикатор), ответ удачный или нет в killResult
export const shellApiWs = createApi({
	reducerPath: 'shellApiWs',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
	}),
	endpoints: (build) => ({
		// spawn
		spawnShell: build.mutation<string, void>({
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
		getShells: build.mutation<string, void>({
			queryFn: () => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('shells');
						resolve({data: 'getShells message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		sendCommand: build.mutation<string, CommandRequest>({
			queryFn: ({cmd, pid}) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('command', {cmd, pid});
						resolve({data: 'command message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		}),
		killShell: build.mutation<string, number>({
			queryFn: (pid) => {
				return new Promise((resolve, reject) => {
					try {
						socket.emit('kill', {pid});
						resolve({data: 'kill message sent'});
					} catch (err) {
						reject({error: err});
					}
				});
			}
		})

	}),
});

export const {
	useGetShellsMutation,
	useKillShellMutation,
	useSpawnShellMutation,
	useSendCommandMutation
} = shellApiWs;