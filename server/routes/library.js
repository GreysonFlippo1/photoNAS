const express = require('express')
const path = require('path')
const router = express.Router()

const scanner = require('../utils/scanner')
const {
    getConfig,
    setHeaders,
} = require('../utils/configurator')

router.use('/:libraryName/:file', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)
    if (searchedLibrary) {
        res.sendFile(path.join(searchedLibrary.path, req.params.file))
    }
})

router.get('/:libraryName', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)

    if (!searchedLibrary) {
        res.status(404).send('Library not found, please ensure the library name is correct')
    }

    scanner(searchedLibrary.path, {force: true})

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

module.exports = router