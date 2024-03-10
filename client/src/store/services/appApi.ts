import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appsApi = createApi({
	reducerPath: 'applicationApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/apps',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		getApps: build.query<Apps, void>({
			query: () => '/'
		})
	}),
});

export const {useGetAppsQuery} = appsApi;