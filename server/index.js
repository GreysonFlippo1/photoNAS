const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

const photo_formats = ["png", "jpg", "gif", "heic"]

function filterFile(file, formats) {
    return formats.includes(`${file.split('.').slice(-1)}`.toLowerCase())
}

app.get('/', (req, res) => res.send('Server is running'))

const getConfig = () => {
    try {
        return require(path.join(__dirname, 'user-config.json'))
    }
    catch (e) {
        console.error('No configuration file')
    }
}

app.get('/libraries', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
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
        return {...lib, info: {...libraryInfo}, preview}
    })
    res.json(libraries)
})

app.use('/library/:libraryName/:file', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const config = getConfig()
    const searchedLibrary = config.libraryDirectories.find(dir => dir.name === req.params.libraryName)
    if (searchedLibrary) {
        res.sendFile(path.join(searchedLibrary.path, req.params.file))
    }
})

app.get('/library/:libraryName', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const config = getConfig()
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

    const files = []

    fs.readdirSync(path.join(searchedLibrary.path)).forEach(file => {
        filterFile(file, photo_formats) && files.push(file)
    });

    libraryInfo.photoCount = files.length

    try {
        fs.writeFileSync(path.join(searchedLibrary.path, 'info.json'), JSON.stringify(libraryInfo), 'utf-8')
    } catch (e) {
        return console.log('failed to auto-update library info')
    }

    const libraryDetails = {
        info: {
            ...searchedLibrary,
            ...libraryInfo
        },
        files: [...files],
    }

    res.json(libraryDetails)
})

app.listen(getConfig().port, () => console.log('serving on port 3000'))
