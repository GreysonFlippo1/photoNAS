const express = require('express')
const app = express()
const {getConfig, setHeaders} = require('./utils/configurator')

app.use(express.json())

app.get('/', (req, res) => res.send('Server is running'))

const libraries = require('./routes/libraries')
const library = require('./routes/library')
const create = require('./routes/create')

app.use('/libraries', libraries)
app.use('/library', library)
app.use('/create', create)

app.listen(getConfig().port, () => console.log('serving on port 3000'))
