const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const {
    getConfig,
    setHeaders,
    filterFile,
    photo_formats
} = require('../utils/configurator')

router.get('/', (req, res) => {
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

module.exports = router