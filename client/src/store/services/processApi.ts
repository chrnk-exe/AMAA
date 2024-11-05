import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const processApi = createApi({
	reducerPath: 'processApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/process',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		killProcess: build.query<void, string>({
			query: (pid) => `/?pid=${pid}`
		})})
});

export const {
	useLazyKillProcessQuery
} = processApi;