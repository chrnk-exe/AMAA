import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const deviceApi = createApi({
	reducerPath: 'devicesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/device',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		getDeviceList: build.query<Devices, void>({
			query: () => ''
		}),
		// it selects device and redirects to /api/apps with cookies. Device ID in cookies
		selectDevice: build.query<Apps, { deviceId: string, type: 'apps' | 'processes' }>({
			query: ({ deviceId, type }) => `/${deviceId}?type=${type}`
		}),
		availableScripts: build.query<string[], void>({
			query: () => '/available_scripts'
		})
	}),

});

export const {
	useGetDeviceListQuery,
	useLazySelectDeviceQuery,
	useLazyGetDeviceListQuery,
	useAvailableScriptsQuery,
	useLazyAvailableScriptsQuery
} = deviceApi;