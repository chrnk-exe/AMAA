import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const staticAnalyzeApi = createApi({
	reducerPath: 'staticAnalyzeApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/static-analyze',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		startStaticAnalyze: build.mutation<void, FormData>({
			query: (file) => ({
				url: '/',
				method: 'POST',
				body: file,
				formData: true
			})
		})
	})
});

export const {
	useStartStaticAnalyzeMutation
} = staticAnalyzeApi;