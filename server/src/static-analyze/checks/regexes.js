// Регулярное выражение для BASE64
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,3}$/;

// Регулярное выражение для MD5
const MD5_REGEX = /^[0-9a-f]{32}$/;

// Регулярное выражение для строк в кавычках или в теге <string>
const STRINGS_REGEX = /(?<=\")(.+?)(?=\")|(?<=\<string>)(.+?)(?=\<)/;

// Регулярное выражение для поиска URI-строк
const URL_REGEX = /((?:https?:\/\/|s?ftps?:\/\/|file:\/\/|javascript:|data:|www\d{0,3}[.])[\w().=\/;,#:@?&~*+!$%'{}-]+)/;

// Регулярное выражение для поиска email-адресов
const EMAIL_REGEX = /[\w+.-]{1,20}@[\w-]{1,20}\.[\w]{2,10}/;

// Регулярное выражение для поиска имен пользователей
const USERNAME_REGEX = /^\w[\w\-\@\.]{1,35}$/;

// Регулярное выражение для поиска ключей API Google
const GOOGLE_API_KEY_REGEX = /^AIza[0-9A-Za-z-_]{35}$/;

// Регулярное выражение для поиска ID приложений Google
const GOOGLE_APP_ID_REGEX = /\d{1,2}:\d{1,50}:android:[a-f0-9]{1,50}/;

module.exports = {
	BASE64_REGEX,
	MD5_REGEX,
	STRINGS_REGEX,
	URL_REGEX,
	EMAIL_REGEX,
	USERNAME_REGEX,
	GOOGLE_API_KEY_REGEX,
	GOOGLE_APP_ID_REGEX
};
