import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:31337', {
	withCredentials: true,
});

export const shellApiWs = createApi({
	reducerPath: 'shellApiWs',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include',
	}),
	endpoints: (builder) => ({
		getMessages: builder.query<string, void>({
			query: () => '',
			async onCacheEntryAdded(
				photoId,
				{ cacheDataLoaded, cacheEntryRemoved, updateCachedData },
			) {
				try {
					await cacheDataLoaded;
					// the /chat-messages endpoint responded already

					socket.on('pong', (message: string) => {
						updateCachedData(() => {
							return message;
						});
					});

					await cacheEntryRemoved;
				} catch {
					// if cacheEntryRemoved resolved before cacheDataLoaded,
					// cacheDataLoaded throws
				}
			},
		}),
	}),
});

export const {useGetMessagesQuery} = shellApiWs;