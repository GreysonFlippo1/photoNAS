const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const router = express.Router()

const scanner = require('../utils/scanner')
const {
    getConfig,
    setHeaders,
    corsOptions
} = require('../utils/configurator')

router.use(cors())

router.get('/library', (req, res) => {
    setHeaders(res)
    const config = getConfig()

    const locations = config.libraryParents.map(p => p.name)
    res.json({
        locations: locations
    })
})

router.post('/library', cors(corsOptions), (req, res) => {
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

    scanner(fullLibraryPath, {force: true})

    res.status(200).send('done!')
}) 

module.exports = router