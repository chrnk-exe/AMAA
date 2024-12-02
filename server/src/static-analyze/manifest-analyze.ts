import BinaryXML from 'binary-xml';
import fs from 'fs';

const dangerousPermissions: string[] = [
	'READ_CONTACTS',
	'WRITE_CONTACTS',
	'GET_ACCOUNTS',
	'READ_CALENDAR',
	'WRITE_CALENDAR',
	'READ_CALL_LOG',
	'WRITE_CALL_LOG',
	'PROCESS_OUTGOING_CALLS',
	'READ_SMS',
	'RECEIVE_SMS',
	'SEND_SMS',
	'RECEIVE_MMS',
	'RECEIVE_WAP_PUSH',
	'READ_EXTERNAL_STORAGE',
	'WRITE_EXTERNAL_STORAGE',
	'CAMERA',
	'RECORD_AUDIO',
	'ACCESS_FINE_LOCATION',
	'ACCESS_COARSE_LOCATION',
	'BODY_SENSORS',
	'INTERNET',
	'ACCESS_NETWORK_STATE',
	'ACCESS_WIFI_STATE',
	'CALL_PHONE',
	'READ_PHONE_STATE',
	'ANSWER_PHONE_CALLS',
	'SYSTEM_ALERT_WINDOW',
	'REQUEST_INSTALL_PACKAGES',
	'WRITE_SETTINGS',
	'USE_SIP',
	'READ_PRIVILEGED_PHONE_STATE',
	'READ_PHONE_NUMBERS'
];

const extractIntents = (application: Application): ChildNode[] => {
	const allIntentFilters: ChildNode[] = [];
	const categories: Array<keyof Application> = ['activities', 'services', 'receivers', 'providers'];

	categories.forEach((category) => {
		application[category].forEach((item: Component) => {
			if (item.childNodes) {
				item.childNodes.forEach((child: ChildNode) => {
					if (child.nodeName === 'intent-filter') {
						allIntentFilters.push(child);
					}
				});
			}
		});
	});

	return allIntentFilters;
};


const extractIntentFilterData = (intentFilterArray: ChildNode[]): IntentFilterData => {
	const schemes: string[] = [];
	const hosts: string[] = [];
	const paths: string[] = [];
	const pathPrefixes: string[] = [];
	const pathPatterns: string[] = [];

	intentFilterArray.forEach((intentFilter) => {
		if (intentFilter.nodeName === 'intent-filter' && intentFilter.childNodes) {
			intentFilter.childNodes.forEach((childNode) => {
				if (childNode.nodeName === 'data' && childNode.attributes) {
					childNode.attributes.forEach((attribute) => {
						const name = attribute.nodeName;
						const value = attribute.value;

						if (name === 'scheme' && value && !schemes.includes(value)) {
							schemes.push(value);
						} else if (name === 'host' && value && !hosts.includes(value)) {
							hosts.push(value);
						} else if (name === 'path' && value && !paths.includes(value)) {
							paths.push(value);
						} else if (name === 'pathPrefix' && value && !pathPrefixes.includes(value)) {
							pathPrefixes.push(value);
						} else if (name === 'pathPattern' && value && !pathPatterns.includes(value)) {
							pathPatterns.push(value);
						}
					});
				}
			});
		}
	});

	return { schemes, hosts, paths, pathPrefixes, pathPatterns };
};


const getExportedEntities = (application: any): any[] => {
	const exportedEntities: ExportedEntity[] = [];

	const categories: Array<keyof Application> = ['activities', 'services', 'receivers', 'providers'];
	categories.forEach(category => {
		application[category].forEach((component: any) => {
			const exportedAttribute = component.attributes.find((attr: any) => attr.nodeName === 'exported');
			const hasIntentFilter = component.childNodes.some((child: any) => child.nodeName === 'intent-filter');

			if (
				(exportedAttribute && exportedAttribute.typedValue.value === true) ||
				(!exportedAttribute && hasIntentFilter)
			) {
				exportedEntities.push({
					category,
					name: component.attributes.find((attr: any) => attr.nodeName === 'name').value
				});
			}
		});
	});

	return exportedEntities;
};

const manifestAnalyze = (pathToManifest: string): ManifestAnalyzeResult => {
	const dangerousPermissionsInAPK: string[] = [];

	const dangerousMinSDK = {
		state: false,
		version: 0
	};
	const dangerousTargetSDK = {
		state: false,
		version: 0
	};

	const criticalAttributes = {
		allowBackup: false,
		debuggable: false,
		usesCleartextTraffic: false
	};

	let isHttpInSchemes = false;


	const data = fs.readFileSync(pathToManifest);
	const reader = new BinaryXML(data);
	const document = reader.parse();
	let packageName = 'app.example.app';
	let version: string | undefined;

	if(document.attributes){
		const pkg = document.attributes.find((attr) => attr.nodeName === 'package')?.typedValue.value.toString();
		if (pkg) {
			packageName = pkg;
		}
		version = document.attributes.find((attr) => attr.nodeName === 'versionName')?.typedValue.value.toString();
	}
	const childNodes = document.childNodes;

	const permissions: string[] = [];
	let sdk: any;
	const application: any = {
		activities: [],
		services: [],
		receivers: [],
		providers: []
	};

	for (const childNode of childNodes) {
		if (childNode.nodeName === 'uses-permission') {
			const { attributes } = childNode;
			const { value } = attributes[0];
			permissions.push(value);
		}

		if (childNode.nodeName === 'uses-sdk') {
			sdk = childNode;
		}

		if (childNode.nodeName === 'application') {
			for (const currentChildNode of childNode.childNodes) {
				if (currentChildNode.nodeName === 'activity') {
					application.activities.push(currentChildNode);
				}
				if (currentChildNode.nodeName === 'provider') {
					application.providers.push(currentChildNode);
				}
				if (currentChildNode.nodeName === 'receiver') {
					application.receivers.push(currentChildNode);
				}
				if (currentChildNode.nodeName === 'service') {
					application.services.push(currentChildNode);
				}
			}

			for (const attribute of childNode.attributes) {
				if (attribute.nodeName === 'debuggable') {
					criticalAttributes.debuggable = !!attribute.typedValue.value;
				}

				if (attribute.nodeName === 'allowBackup') {
					criticalAttributes.allowBackup = !!attribute.typedValue.value;
				}

				if (attribute.nodeName === 'usesCleartextTraffic') {
					criticalAttributes.usesCleartextTraffic = !!attribute.typedValue.value;
				}
			}
		}
	}

	for (const permission of permissions) {
		const originalPermission = permission.split('.')[permission.split('.').length - 1];

		if (dangerousPermissions.includes(originalPermission)) {
			dangerousPermissionsInAPK.push(originalPermission);
		}
	}

	for (const attr of sdk.attributes) {
		if (attr.nodeName === 'minSdkVersion') {
			const minSdkVersion = attr.typedValue.value;
			dangerousMinSDK.state = minSdkVersion < 23;
			dangerousMinSDK.version = minSdkVersion;
		} else if (attr.nodeName === 'targetSdkVersion') {
			const targetSdkVersion = attr.typedValue.value;
			dangerousTargetSDK.state = targetSdkVersion < 31;
			dangerousTargetSDK.version = targetSdkVersion;
		}
	}

	const intentFilters = extractIntents(application);
	const allIntentFilters = extractIntentFilterData(intentFilters);
	isHttpInSchemes = allIntentFilters.schemes.includes('http');
	const exportedEntities = getExportedEntities(application);

	return {
		packageName,
		version,
		permissionsAnalyze: dangerousPermissionsInAPK,
		exportedEntitiesAnalyze: exportedEntities,
		intentFiltersAnalyze: allIntentFilters,
		criticalAttributesAnalyze: criticalAttributes,
		SDKAnalyze: { dangerousTargetSDK, dangerousMinSDK },
		isHttpInSchemes
	};
};

export default manifestAnalyze;

