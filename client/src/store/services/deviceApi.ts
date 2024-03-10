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
		selectDevice: build.query<Apps, string>({
			query: (deviceId) => `/${deviceId}`
		})
	}),

});

export const {useGetDeviceListQuery, useLazySelectDeviceQuery} = deviceApi;