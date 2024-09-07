const express = require('express')
const path = require('path')
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

// default library path for ease of use
app.use('/library', express.static(path.join(__dirname, defaultLibrary.path)))

app.listen(3000, () => console.log('listening on port 3000'))
