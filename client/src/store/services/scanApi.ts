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
		getDynamicAnalyzeReport: build.query<Blob, number>({
			query: (scanId) => ({
				url: `/dynamic-analyze/report/${scanId}`,
				method: 'GET',
				responseHandler: async (response) => {
					// Проверяем, что ответ содержит бинарные данные (PDF)
					if (!response.ok) {
						throw new Error('Failed to fetch PDF report');
					}
					return await response.blob(); // Возвращаем Blob для обработки на клиенте
				},
			})
		}),
		getStaticAnalyzeReport: build.query<Blob, number>({
			query: (scanId) => ({
				url: `/static-analyze/report/${scanId}`,
				method: 'GET',
				responseHandler: async (response) => {
					// Проверяем, что ответ содержит бинарные данные (PDF)
					if (!response.ok) {
						throw new Error('Failed to fetch PDF report');
					}
					return await response.blob(); // Возвращаем Blob для обработки на клиенте
				},
			})
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