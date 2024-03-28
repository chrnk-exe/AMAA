import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { io } from 'socket.io-client';

import socket from '../../socket';

export const fileApiWs = createApi({
	reducerPath: 'fileApiWs',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
	}),
	endpoints: build => ({
		mockup: build.mutation<string, void>({
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
	useMockupMutation
} = fileApiWs;
