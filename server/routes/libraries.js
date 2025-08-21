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
        let preview = []

        try {
            libraryInfo = require(path.join(lib.path, 'info.json'))
        } catch (error) {
            console.log(`warning: library "${lib.name}" lacks info.json file:`, error)
        }
        if (req.query.preview) {
            let photos = Object.keys(libraryInfo.photos)
            if (photos.length) {
                const previewLength = photos.length > req.query.preview ? req.query.preview : photos.length
                preview = photos.slice( -1 * previewLength )
            }
        }
        const location = config.libraryParents.filter(p => lib.path.startsWith(p.path))
        lib.location = location
        return {...lib, info: {...libraryInfo}, preview}
    })
    res.json(libraries)
})

module.exports = router