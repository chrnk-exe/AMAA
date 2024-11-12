const frida = require('frida');

async function main() {

	const deviceId = 'R58R6308HCP';
	// Подключаемся к устройству
	const device = await frida.getDevice(deviceId);

	// Подключаемся к процессу
	const pid = await device.spawn(['tech.httptoolkit.pinning_demo']);  // имя пакета приложения
	const session = await device.attach(pid);

	// Загружаем скрипт
	const script = await session.createScript(`
        Java.perform(function() {
            const Activity = Java.use('android.app.Activity');

            Activity.onResume.implementation = function() {
                send('Activity resumed: ' + this);
                this.onResume();
            };

            // Переопределяем console.log для отправки сообщений в основной процесс
            console.log = function(message) {
                send('Log: ' + message);
            };

            // Пример использования console.log
            console.log('Frida script loaded');
        });
    `);

	// Ловим сообщения, отправленные из скрипта
	script.message.connect(message => {
		if (message.type === 'send') {
			console.log('Message from script:', message.payload);  // выводим лог
		} else if (message.type === 'error') {
			console.error('Script error:', message.stack);
		}
	});

	// Загружаем и запускаем скрипт
	await script.load();
	await device.resume(pid);
}

main().catch(error => {
	console.error(error);
});

console.log = function(message) {
	send('Log: ' + message);
};