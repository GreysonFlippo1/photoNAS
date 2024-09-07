const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

//user config
const config = require('./config.json')

app.get('/', (req, res) => res.send('Server is running'))

const defaultLibrary = config.libraryDirectories.find(dir => dir.isDefault)

app.use('/library/:libraryName/:file', (req, res) => {
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)
    if (searchedLibrary) {
        res.sendFile(path.join(__dirname, searchedLibrary.path, req.params.file))
    }
})

app.get('/library/:libraryName', (req, res) => {
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)

    if (!searchedLibrary) {
        res.sendStatus(404)
    }

    let libraryInfo = {}
    try {
        libraryInfo = require(path.join(__dirname, searchedLibrary.path, 'info.json'))
    } catch (err) {
        // console.log('library has no info file')
    } 

    const libraryDetails = {
        info: {
            ...searchedLibrary,
            ...libraryInfo
        },
        files: [],
    }

    fs.readdirSync(path.join(__dirname, searchedLibrary.path)).forEach(file => {
        libraryDetails.files.push(file)
    });

    res.json(JSON.stringify(libraryDetails))
})

app.listen(3000, () => console.log('listening on port 3000'))
