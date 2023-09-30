const defaultPath = `${__dirname}/storage/`;

const NetworkDataId = {
    table_data : '1hVpfy4j9G35SGKNaSq8iO9PVz63DSAJlPUfOY7y8UxM',
    table_auth : '1XUd9d4_YWI5SjY2z40TtAlUgDRe9KbAkHKCuPMwgUzI'
}

const PathData = {
    path_to_render :   `${defaultPath}renderComponent`,
    path_to_local  :   `${defaultPath}localData/`,
    path_to_auth   :   `${defaultPath}auth/`,
    path_to_logs   :   `${defaultPath}logs/`,
    path_to_files  :   `${defaultPath}files/`,
}

const AuthLists = {
    path_to_admins :   `${PathData.path_to_auth}admins_users_data.json`,
    path_to_members  :   `${PathData.path_to_auth}users_data.json`,
    path_to_members_s   :   `${PathData.path_to_auth}users_data_s.json`,
    path_to_banned   :   `${PathData.path_to_auth}banned_users_data.json`,
}

const HelpList = [
    '/cls : очистка консоли',
    '/logrender : отправляет файл рендера(все данные используемые в данный момент)',
    '/getbanlist : отправляет сообщением/файлом лист забанненых людей',
    '/getmemberslist : отправляет сообщением/файлом лист пользователей',
    '/getadminslist : отправляет сообщением/файлом лист админов',
    '/getfileslist : отправляет список файлов (презентации к продуктам и т.п.)'
]

module.exports = {
    NetworkDataId,
    PathData,
    HelpList,
    AuthLists
}