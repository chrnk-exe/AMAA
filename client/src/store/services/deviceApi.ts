import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import exp from 'node:constants';

export const deviceApi = createApi({
	reducerPath: 'applicationApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/device',
	}),
	endpoints: (build) => ({
		getDeviceList: build.query<Device[], void>({
			query: () => ''
		})
	}),
});

export const {useGetDeviceListQuery} = deviceApi;