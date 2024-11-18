import BinaryXML from 'binary-xml';
import fs from 'fs';

const dangerousPermissions = [
	'READ_CONTACTS',              // Доступ к контактам пользователя
	'WRITE_CONTACTS',             // Изменение контактов пользователя
	'GET_ACCOUNTS',               // Доступ к учетным записям на устройстве
	'READ_CALENDAR',              // Доступ к календарю и событиям пользователя
	'WRITE_CALENDAR',             // Изменение календаря и событий пользователя
	'READ_CALL_LOG',              // Доступ к журналу вызовов
	'WRITE_CALL_LOG',             // Изменение журнала вызовов
	'PROCESS_OUTGOING_CALLS',     // Обработка исходящих вызовов
	'READ_SMS',                   // Чтение SMS-сообщений
	'RECEIVE_SMS',                // Получение SMS-сообщений
	'SEND_SMS',                   // Отправка SMS-сообщений
	'RECEIVE_MMS',                // Получение MMS-сообщений
	'RECEIVE_WAP_PUSH',           // Получение WAP-сообщений
	'READ_EXTERNAL_STORAGE',      // Доступ к файлам пользователя
	'WRITE_EXTERNAL_STORAGE',     // Изменение файлов пользователя
	'CAMERA',                     // Доступ к камере для фото и видео
	'RECORD_AUDIO',               // Запись аудио через микрофон
	'ACCESS_FINE_LOCATION',       // Точное определение местоположения
	'ACCESS_COARSE_LOCATION',     // Приблизительное местоположение
	'BODY_SENSORS',               // Доступ к сенсорам устройства, например, к данным о здоровье
	'INTERNET',                   // Доступ к интернету (риск утечки данных)
	'ACCESS_NETWORK_STATE',       // Информация о сети (может помочь в отслеживании активности)
	'ACCESS_WIFI_STATE',          // Доступ к информации о Wi-Fi (возможность определения местоположения)
	'CALL_PHONE',                 // Совершение звонков без участия пользователя
	'READ_PHONE_STATE',           // Доступ к данным об устройстве (IMEI, статус сети)
	'ANSWER_PHONE_CALLS',         // Прием входящих звонков программно
	'SYSTEM_ALERT_WINDOW',        // Наложение окон поверх других приложений (может использоваться для фишинга)
	'REQUEST_INSTALL_PACKAGES',   // Установка пакетов (риск установки вредоносного ПО)
	'WRITE_SETTINGS',             // Изменение глобальных настроек устройства
	'USE_SIP',                    // Использование SIP-протокола для вызовов (может обходить платные звонки)
	'READ_PRIVILEGED_PHONE_STATE',// Привилегированный доступ к состоянию телефона
	'READ_PHONE_NUMBERS'          // Чтение номера телефона устройства
];


const extractIntents = (application) => {
	const allIntentFilters = []
	const categories = ['activities', 'services', 'receivers', 'providers'];
	categories.forEach(category => {
		// Для каждой категории проходим по элементам
		application[category].forEach(item => {
			// Проверяем, есть ли childNodes
			if (item.childNodes) {
				// Ищем все intent-filter в childNodes
				item.childNodes.forEach(child => {
					if (child.nodeName === 'intent-filter') {
						allIntentFilters.push(child);
					}
				});
			}
		});
	});

	return allIntentFilters;
}

const extractIntentFilterData = (intentFilterArray) => {
	const schemes = [];
	const hosts = [];
	const paths = [];
	const pathPrefixes = [];
	const pathPatterns = [];

	intentFilterArray.forEach(intentFilter => {
		// Проверяем, что это intent-filter с дочерними элементами
		if (intentFilter.nodeName === 'intent-filter' && intentFilter.childNodes) {
			// Перебираем childNodes, чтобы найти элементы "data"
			intentFilter.childNodes.forEach(childNode => {
				if (childNode.nodeName === 'data' && childNode.attributes) {
					childNode.attributes.forEach(attribute => {
						const name = attribute.nodeName;
						const value = attribute.value;

						// В зависимости от атрибута добавляем его в соответствующий массив
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
}

const getExportedEntities = (application) => {
	const exportedEntities = [];

	// Перебираем все категории компонентов
	const categories = ['activities', 'services', 'receivers', 'providers'];
	categories.forEach(category => {
		application[category].forEach(component => {
			// Поиск атрибута exported
			const exportedAttribute = component.attributes.find(attr => attr.nodeName === 'exported');
			const hasIntentFilter = component.childNodes.some(child => child.nodeName === 'intent-filter');

			// Логика определения экспортируемости
			if (
				(exportedAttribute && exportedAttribute.typedValue.value === true) || // Явно установлен exported=true
				(!exportedAttribute && hasIntentFilter) // Отсутствие атрибута exported + наличие intent-filter
			) {
				exportedEntities.push({
					category,
					name: component.attributes.find(attr => attr.nodeName === 'name').value
				});
			}
		});
	});

	return exportedEntities;
}

const manifestAnalyze = (pathToManifest) => {
	// Переменные для результата анализа

	// Опасные привелегии
	const dangerousPermissionsInAPK = []


	// min и target sdk
	const dangerousMinSDK = {
		state: false,
		version: 0
	}
	const dangerousTargetSDK = {
		state: false,
		version: 0
	}

	// Критичные атрибуты
	const criticalAttributes = {
		allowBackup: false,
		debuggable: false,
		usesCleartextTraffic: false
	}

	// наличие схемы http (без шифрования - угроза mitm)

	let isHttpInSchemes = false;

	// Нужные для обработки манифеста переменные
	const data = fs.readFileSync(pathToManifest);
	const reader = new BinaryXML(data);
	const document = reader.parse();

	const packageName = document.attributes.find(attr => attr.nodeName === 'package').typedValue.value
	const childNodes = document.childNodes

	const permissions = []
	let sdk
	const application = {
		activities: [],
		services: [],
		receivers: [],
		providers: []
	}



	// PERMISSIONS
	// ==========================
	// 	Получаем permissions, SDK и ТД
	for (let childNode of childNodes) {
		if (childNode.nodeName === 'uses-permission') {
			const {attributes} = childNode
			const {value} = attributes[0]
			permissions.push(value)
		}

		if (childNode.nodeName === 'uses-sdk') {
			sdk = childNode
		}

		if (childNode.nodeName === 'application') {
			for (const currentChildNode of childNode.childNodes) {
				if (currentChildNode.nodeName === 'activity') {
					application.activities.push(currentChildNode)
				}
				if (currentChildNode.nodeName === 'provider') {
					application.providers.push(currentChildNode)
				}
				if (currentChildNode.nodeName === 'receiver') {
					application.receivers.push(currentChildNode)
				}
				if (currentChildNode.nodeName === 'service') {
					application.services.push(currentChildNode)
				}
			}

			// Check critical attributes:

			for (const attribute of childNode.attributes) {
				if (attribute.nodeName === 'debuggable') {
					criticalAttributes.debuggable = attribute.typedValue.value
				}

				if (attribute.nodeName === 'allowBackup') {
					criticalAttributes.allowBackup = attribute.typedValue.value
				}

				if (attribute.nodeName === 'usesCleartextTraffic') {
					criticalAttributes.usesCleartextTraffic = attribute.typedValue.value
				}
			}

		}
	}

	// Анализируем их


	for (let permission of permissions) {
		const originalPermission = permission.split('.')[permission.split('.').length - 1]

		if (dangerousPermissions.includes(originalPermission)) {
			dangerousPermissionsInAPK.push(originalPermission)
		}
	}



	// 	После выполнения в dangerousPermissionsInAPK лежит список опасных пермишнс



	// Check SDK
	for( const attr of sdk.attributes) {
		if (attr.nodeName === 'minSdkVersion') {
			const minSdkVersion = attr.typedValue.value
			dangerousMinSDK.state = minSdkVersion < 23
			dangerousMinSDK.version = minSdkVersion
		} else if (attr.nodeName === 'targetSdkVersion') {
			const targetSdkVersion = attr.typedValue.value
			dangerousTargetSDK.state = targetSdkVersion < 31
			dangerousTargetSDK.version = targetSdkVersion
		}
	}


	// console.log('DangerPerms:', dangerousPermissionsInAPK)
	// console.log('SDK:', dangerousMinSDK, dangerousTargetSDK)
	// console.log('Check critical attributes', criticalAttributes)
	//
	// console.log(application)

	// Grab intent-filters
	const intentFilters = extractIntents(application)
	const allIntentFilters = extractIntentFilterData(intentFilters)

	isHttpInSchemes = allIntentFilters.schemes.includes('http')

	// Надо прочекать экспортируемые Application Components

	// console.log(application.activities[0].attributes)

	const exportedEntities = getExportedEntities(application)

	return {
		permissionsAnalyze: dangerousPermissionsInAPK,
		exportedEntitiesAnalyze: exportedEntities,
		intentFiltersAnalyze: intentFilters,
		criticalAttributesAnalyze: criticalAttributes,
		SDKAnalyze: {dangerousTargetSDK, dangerousMinSDK}
	};

};

// manifestAnalyze('./files/AndroidManifestBank.xml')
// manifestAnalyze('./files/AndroidManifestBSPB.xml')
export default manifestAnalyze;