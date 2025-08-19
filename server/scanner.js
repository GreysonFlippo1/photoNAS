const path = require('path')
const fs = require('fs')

const photo_formats = ["png", "jpg", "gif", "heic", "jpeg", "webp"]
const scanInverval = 1000 * 60 * 60 * 24 // 1 day

const filterFile = (file, formats) => {
    return formats.includes(`${file.split('.').slice(-1)}`.toLowerCase())
}

/*
scans existing library for new photos

options:
    recursive: bool - checks for photos in subdirectories
    force: bool - scan regardless of last scan time
*/
const scanLibrary = (directory, options = {}) => {
    let libraryInfo = {}
    try {
        libraryInfo = require(path.join(directory, 'info.json'))
    } catch (err) {
        return console.log(`error: ${directory} is not a library`)
    }

    if (!options.force && new Date() - new Date(libraryInfo.updated) < scanInverval) {
        return console.log('skipping scan')
    }

    const files = []

    fs.readdirSync(path.join(directory)).forEach(file => {
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
        }

        Object.keys(removelist).forEach(oldFile => {
            delete libraryInfo.photos[oldFile]
        })
    })

    try {
        fs.writeFileSync(path.join(directory, 'info.json'), JSON.stringify(libraryInfo), 'utf-8')
    } catch (e) {
        return console.log('failed to auto-update library info')
    }

    return console.log('scan completed: ', libraryInfo.updated)
}

module.exports = scanLibrary
