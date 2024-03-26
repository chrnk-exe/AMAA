## SERVER

Доки нет, всё что есть по папкам:

* app.ts - главный файл приложения
* routes - пути, использумые в приложении
  * ws - API использующее веб-сокеты (Шариться в папках можно и исполнять команды)
  * http - API использующее протокол HTTP (запуск тестов, получение инфы с девайса)
* controllers - контроллеры (пока 2, контролят наличие нужных кук)
* frida-services - JS скрипты работы с Frida (в тч неиспользуемые)
  * owaspTesting - десять скриптов, прогоняющих различные проверки приложения по оваспу
* utils - различные утилиты/костыли 

/api/*
### app API

**device required**
* GET /apps?type={'apps' | 'processes'} - листинг приложений или процессов
* GET /apps/:appPackageName/start - стартует приложение без скриптом
* GET /apps/:appPackageName/get_apk - достаёт апк

### devices API

* GET /device
* GET /device/:deviceId

### testing API

* GET / - все проверки
* GET /:testingNumber - проверка под номером __testingNumber__

### shell API (http)

* GET /shell?pid=number - информация об инстансе консоли
* GET /shells - информация обо всех консолях
* POST /shell - создание шелла
* POST /shell/command - выполнение команды и получение результата в шелле 
```json
{"pid":number,"cmd":string}
```
* DELETE /shell?pid=number - удаление шелла

### shell API (web-sockets)

События, на которые может подписатся клиент:
* commandResult - вывод команды вместе с индексом консоли
* spawnedShell - информация об удачном спавне шелла
* shellsList - список текущих шеллов
* killResult - удачное или неудачное убийство процесса шелла

События, на которые отвечает сервер:
* spawn - создание шелла
* shells - запрос шеллов в shellsList
* command - выполнение команды, ответ приходит в commandResult

Request:
```json
{"pid": 1,"cmd": "id"}
```
Response (может быть несколько, в зависимости от вывода):
```json
{"pid": 1,"commandOutput": "uid=0(root)..."}
```

* kill - удаление шелла, указывается его pid (идентфикатор), ответ удачный или нет в killResult

### files API (web-sockets)