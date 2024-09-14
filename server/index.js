const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

//user config
const config = require('./user-config.json')

app.get('/', (req, res) => res.send('Server is running'))

// const defaultLibrary = config.libraryDirectories.find(dir => dir.isDefault)
app.get('/libraries', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const libraries = config.libraryDirectories.map(lib => {
        let libraryInfo = {}
        const preview = []

        try {
            libraryInfo = require(path.join(lib.path, 'info.json'))
        } catch (err) {
            console.log(`warning: library "${lib.name}" lacks info.json file`)
        }
        if (req.query.preview) {
            fs.readdirSync(path.join(lib.path)).forEach((file, i) => {
                if (i < req.query.preview) {
                    preview.push(file)
                }
            });
        }
        return {...lib, info: {...libraryInfo}, preview}
    })
    res.json(libraries)
})

app.use('/library/:libraryName/:file', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)
    if (searchedLibrary) {
        res.sendFile(path.join(searchedLibrary.path, req.params.file))
    }
})

app.get('/library/:libraryName', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)

    if (!searchedLibrary) {
        res.status(404).send('Library not found, please double check the library name is correct')
    }

    let libraryInfo = {}
    try {
        libraryInfo = require(path.join(searchedLibrary.path, 'info.json'))
    } catch (err) {
        console.log(`warning: library "${searchedLibrary}" lacks info.json file`)
    } 

    const libraryDetails = {
        info: {
            ...searchedLibrary,
            ...libraryInfo
        },
        files: [],
    }

    fs.readdirSync(path.join(searchedLibrary.path)).forEach(file => {
        libraryDetails.files.push(file)
    });

    res.json(libraryDetails)
})

app.listen(config.port, () => console.log('serving on port 3000'))
