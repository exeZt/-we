const defaultPath = `${__dirname}/storage/`; // главный путь в хранилище
const Key = '6622325045:AAGvsTESM1g0b0DRbkXt5Wg42R7foGsizHE' // api ключ от бота

const telegramSettings = {
    parse_mode: 'markdown' // тип рендера сообщения markdown/HTML
}

const NetworkDataId = {
    table_data : '1hVpfy4j9G35SGKNaSq8iO9PVz63DSAJlPUfOY7y8UxM', // id гугл книги с информацией и клавиатурой
    table_auth : '1XUd9d4_YWI5SjY2z40TtAlUgDRe9KbAkHKCuPMwgUzI' // id гугл книги с доступами
}

const PathData = {
    path_to_local  :   `${defaultPath}localData/`,// путь к локальными данными
    path_to_auth   :   `${defaultPath}auth/`,// путь к доступам
    path_to_logs   :   `${defaultPath}logs/`,// путь к логам
    path_to_files  :   `${defaultPath}files/`, // путь к файлам
    path_to_media  :   `${defaultPath}media/` // путь к медиа файлам
}

const AuthLists = {
    path_to_admins   :   `${PathData.path_to_auth}admins_users_data.json`, // путь к файлу с админами
    path_to_members  :   `${PathData.path_to_auth}users_data.json`, // путь к файлу с пользователями
    path_to_members_s:   `${PathData.path_to_auth}users_data_s.json`, // путь к файлу с пользователями(сокращенный)
    path_to_banned   :   `${PathData.path_to_auth}banned_users_data.json`, // путь к файлу с забанеными
}

const HelpList = [ // сообщение с помощью (только админы)
    '/cls : очистка консоли',
    '/logrender : отправляет файл рендера(все данные используемые в данный момент)',
    '/getbanlist : отправляет сообщением/файлом лист забанненых людей',
    '/getmemberslist : отправляет сообщением/файлом лист пользователей',
    '/getadminslist : отправляет сообщением/файлом лист админов',
    '/getfileslist : отправляет список файлов (презентации к продуктам и т.п.)'
]

// тех.
module.exports = {
    NetworkDataId,
    PathData,
    HelpList,
    AuthLists,
    Key,
    telegramSettings
}