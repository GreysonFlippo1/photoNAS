const express = require('express')
const path = require('path')
const {readFileSync} = require('fs')
const router = express.Router()

const {
    getConfig,
    setHeaders,
} = require('../utils/configurator')

router.get('/', (req, res) => {
    setHeaders(res)
    const config = getConfig()
    const libraries = config.libraryDirectories.map(lib => {
        let libraryInfo = {}
        let preview = []

        try {
            libraryInfo = JSON.parse(readFileSync(path.join(lib.path, 'info.json'), {encoding: 'utf-8'}))
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
        delete libraryInfo.photos
        const location = config.libraryParents.filter(p => lib.path.startsWith(p.path))
        lib.location = location
        return {...lib, info: {...libraryInfo}, preview}
    })
    res.json(libraries)
})

module.exports = router