const express = require('express')
const path = require('path')
const app = express()

//user config
const config = require('./config.json')

app.get('/', (req, res) => res.send('Server is running'))

app.use('/library', express.static(path.join(__dirname, config.libraryDirectories[0])))

app.listen(3000, () => console.log('listening on port 3000'))
