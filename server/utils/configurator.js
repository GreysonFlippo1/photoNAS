const path = require('path')

const photo_formats = ["png", "jpg", "gif", "heic", "jpeg", "webp"]

const getConfig = () => {
    try {
        return require(path.join(__dirname, '../user-config.json')) // change this directory
    }
    catch (e) {
        console.error('No configuration file')
    }
}

const setHeaders = (res) => {
    const config = getConfig()
    res.setHeader('Access-Control-Allow-Origin', config.clientAddress)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const corsOptions = {
    origin: getConfig().clientAddress,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

function filterFile(file, formats) {
    return formats.includes(`${file.split('.').slice(-1)}`.toLowerCase())
}

function getPhotoFormats() {
    const config = getConfig()
    return config?.photo_formats ?? photo_formats
}

module.exports = {
    getConfig,
    setHeaders,
    filterFile,
    corsOptions,
    photo_formats: getPhotoFormats(),
}