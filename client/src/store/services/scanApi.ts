import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scanApi = createApi({
	reducerPath: 'scanApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/scans',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		getScans: build.query<ScanRecord[], void>({
			query: () => '/'
		}),
		startStaticAnalyze: build.mutation<void, FormData>({
			query: (file) => ({
				url: '/static-analyze',
				method: 'POST',
				body: file,
				formData: true
			})
		}),
		startDynamicAnalyze: build.query<void, string>({
			query: (packageName) => `/dynamic-analyze/${packageName}`
		}),
		getDynamicAnalyzeReport: build.query<void, number>({
			query: (scanId) => `/dynamic-analyze/report/${scanId}`
		}),
		getStaticAnalyzeReport: build.query<void, number>({
			query: (scanId) => `/static-analyze/report/${scanId}`
		})
	}),
});

export const {
	useLazyGetScansQuery,
	useGetScansQuery,
	useStartStaticAnalyzeMutation,
	useLazyStartDynamicAnalyzeQuery,
	useLazyGetDynamicAnalyzeReportQuery,
	useLazyGetStaticAnalyzeReportQuery
} = scanApi;