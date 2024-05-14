import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const appsApi = createApi({
	reducerPath: 'applicationApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:31337/api/apps',
		credentials: 'include'
	}),
	endpoints: (build) => ({
		getApps: build.query<App[], void>({
			query: () => '/?type=apps'
		}),
		getProcesses: build.query<Process[], void>({
			query: () => '/?type=processes'
		}),
		spawnApplication: build.query<number, string>({
			query: (appPackageName) => `/${appPackageName}/start`
		}),
		spawnApplicationWithScripts: build.mutation<void, {code?: string, scripts:string[], appPackageName: string}>({
			query: ({ appPackageName, scripts, code }) => ({
				url: `/${appPackageName}/start_testing`,
				method: 'POST',
				body: {
					scripts,
					code
				}
			})
		})
	}),
});


export const {
	useGetAppsQuery,
	useLazyGetAppsQuery,
	useLazyGetProcessesQuery,
	useLazySpawnApplicationQuery,
	useSpawnApplicationWithScriptsMutation
} = appsApi;