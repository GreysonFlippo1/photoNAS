const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const app = express()

const scanner = require('./scanner')

app.use(cors())
app.use(express.json())

const getConfig = () => {
    try {
        return require(path.join(__dirname, 'user-config.json'))
    }
    catch (e) {
        console.error('No configuration file')
    }
}

const corsOptions = {
    origin: getConfig().clientAddress,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const photo_formats = ["png", "jpg", "gif", "heic", "jpeg", "webp"]

function filterFile(file, formats) {
    return formats.includes(`${file.split('.').slice(-1)}`.toLowerCase())
}

app.get('/', (req, res) => res.send('Server is running'))

const setHeaders = (res) => {
    const config = getConfig()
    res.setHeader('Access-Control-Allow-Origin', config.clientAddress)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

app.get('/libraries', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const libraries = config.libraryDirectories.map(lib => {
        let libraryInfo = {}
        const preview = []

        try {
            libraryInfo = require(path.join(lib.path, 'info.json'))
        } catch (err) {
            console.log(`warning: library "${lib.name}" lacks info.json file`)
        }
        if (req.query.preview) {
            fs.readdirSync(path.join(lib.path)).forEach(file => {
                if (preview.length < req.query.preview && filterFile(file, photo_formats)) {
                    preview.push(file)
                }
            });
        }
        const location = config.libraryParents.filter(p => lib.path.startsWith(p.path))
        lib.location = location
        return {...lib, info: {...libraryInfo}, preview}
    })
    res.json(libraries)
})

app.use('/library/:libraryName/:file', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)
    if (searchedLibrary) {
        res.sendFile(path.join(searchedLibrary.path, req.params.file))
    }
})

app.get('/library/:libraryName', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)

    if (!searchedLibrary) {
        res.status(404).send('Library not found, please ensure the library name is correct')
    }

    scanner(searchedLibrary.path, {force: false})

    let libraryInfo = {}
    try {
        libraryInfo = require(path.join(searchedLibrary.path, 'info.json'))
    } catch (err) {
        console.log(`error: library "${req.params.libraryName}" lacks info.json file`)
        res.status(404).send('Library not found, please ensure the library name is correct')
    } 

    const location = config.libraryParents.filter(p => searchedLibrary.path.startsWith(p.path))
    searchedLibrary.location = location

    const libraryDetails = {
        info: {
            ...searchedLibrary,
            ...libraryInfo
        }
    }

    res.json(libraryDetails)
})

app.get('/create/library', (req, res) => {
    setHeaders(res)
    const config = getConfig()

    const locations = config.libraryParents.map(p => p.name)
    res.json({
        locations: locations
    })
})

app.post('/create/library', cors(corsOptions), (req, res) => {
    setHeaders(res)
    const {
        libraryParent, // from the list (will be the name only)
        location, //library folder name
        data //library info (name, description ...)
    } = req.body

    if (!libraryParent) {
        res.status(400).send('Missing library parent location')
        return
    }
    if (!location) {
        res.status(400).send('Missing library folder name')
        return
    }
    if (!data.name) {
        res.status(400).send('Missing library name')
        return
    }

    const created = new Date()
    const config = getConfig()

    const parentLocation = config.libraryParents.find(lib => lib.name === libraryParent)
    const fullLibraryPath = path.join(parentLocation.path, location)

    const configData = {
        name: location,
        path: fullLibraryPath
    }

    const updatedConfig = {
        ...config,
        libraryDirectories: [...config.libraryDirectories, configData]
    }


    const infoData = {
        description: data.description ?? '',
        created: created.toString(),
        updated: created.toString(),
        photoCount: 0,
        videoCount: 0
    }

    if (!fs.existsSync(fullLibraryPath)){
        fs.mkdirSync(fullLibraryPath);
    }

    fs.writeFileSync(path.join(fullLibraryPath, 'info.json'), JSON.stringify(infoData), 'utf-8')
    fs.writeFileSync(path.join(__dirname, 'user-config.json'), JSON.stringify(updatedConfig), 'utf-8')

    scanner(fullLibraryPath)

    res.status(200).send('done!')
}) 

app.listen(getConfig().port, () => console.log('serving on port 3000'))
