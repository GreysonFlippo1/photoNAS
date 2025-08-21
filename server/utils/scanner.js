const path = require('path')
const fs = require('fs')
const {getConfig, filterFile, photo_formats} = require('./configurator')

const scanIntervalDefault = 1000 * 60 * 60 * 24 // 1 day default

/*
scans existing library for:
 - new photos
 - removed photos
 - updated photo metadata

options:
    force: bool - scan regardless of last scan time
*/
const scanLibrary = (directory, options = {}) => {
    const config = getConfig()
    let libraryInfo = {}
    try {
        libraryInfo = require(path.join(directory, 'info.json'))
    } catch (error) {
        return console.log(`error: ${directory} is not a library:`, error)
    }

    const scanInterval = config.autoScan ?? scanIntervalDefault

    if (!options.force && new Date() - new Date(libraryInfo.updated) < scanInterval) {
        return void 0;
    }

    const files = []
    const recursive = !!libraryInfo.includeSubDirectories

    fs.readdirSync(path.join(directory), {recursive}).forEach(file => {
        filterFile(file, photo_formats) && files.push(file)
    });

    libraryInfo.photoCount = files.length
    libraryInfo.updated = new Date()

    if (!libraryInfo.photos) {
        libraryInfo.photos = {}
    }

    files.forEach(file => {
        const removelist = {}
        Object.keys(libraryInfo.photos).forEach(oldFile => {
            removelist[oldFile]
        })

        if (!libraryInfo.photos[file]) {
            libraryInfo.photos[file] = {}
        } else if(libraryInfo.photos[file]) {
            delete removelist[file]
            // const metadata = {} // store exif metadata
            // libraryInfo.photos[file].metadata = metadata
        }

        Object.keys(removelist).forEach(oldFile => {
            delete libraryInfo.photos[oldFile]
        })
    })

    try {
        fs.writeFileSync(path.join(directory, 'info.json'), JSON.stringify(libraryInfo), 'utf-8')
    } catch (error) {
        return console.log('failed to auto-update library info:', error)
    }

    return console.log('scan completed: ', directory, libraryInfo.updated)
}

const autoScan = () => {
    const {autoScan, libraryDirectories} = getConfig()
    const scanInterval = autoScan ?? scanIntervalDefault

    libraryDirectories.forEach(directory => {
        scanLibrary(directory.path, {force: true})
    })

    setTimeout(() => { autoScan() }, scanInterval)
}

module.exports = {
    scanLibrary,
    autoScan
}
