const fs = require('fs');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const { GoogleKey } = require('../config');
const TOKEN_PATH = './';
const CREDENTIALS_PATH = path.join(`${__dirname}/credentials.json`);

async function loadSavedCredentialsIfExist() {
    try {
        const content = GoogleKey;
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
    const drive = google.drive({version: 'v3', auth: authClient});
    const res = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    });
    const files = res.data.files;
    if (files.length === 0) {
        console.log('No files found.');
        return;
    }

    console.log('Files:');
    files.map((file) => {
        console.log(`${file.name} (${file.id})`);
    });
}
authorize().then(v => GetFilesFromDrive())

function GetFilesFromDrive(authClient) {
    authorize()
        .then(r => {
            const drive = google.drive({version: 'v3', auth: authClient});
            var folderid = "1ksyjNFWttHlQw3RjfFde8GM8_HhXn907";
            drive.files.list({
                auth: authClient,
                q: "'" + folderid + "' in parents and trashed=false",
                fields: "files(id, name)"
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }
                // response.files.forEach(function(e){
                //     if (e.name.includes('doc')) {
                //         var dlfile = fs.createWriteStream(e.name + ".txt");
                //         drive.files.export({
                //             auth: auth,
                //             fileId: e.id,
                //             mimeType: 'text/plain'
                //         }).on('end', function() {
                //             console.log("Done.");
                //         }).on('error', function(err) {
                //             console.error(err);
                //             return process.exit();
                //         }).pipe(dlfile);
                //     }
                // });
            });
        })
}