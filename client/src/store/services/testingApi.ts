import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const testingApi = createApi({
	reducerPath: 'testingApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/testing',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		getAllTestingResults: build.query<any, void>({
			query: () => ''
		}),
		getOneTestingResults: build.query<any, {testNumber: number}>({
			query: (testNumber) => `/${testNumber}`
		})
	}),

});

export const {
	useLazyGetAllTestingResultsQuery,
	useLazyGetOneTestingResultsQuery
} = testingApi;