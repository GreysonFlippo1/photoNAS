import * as React from 'react'
const config = require('../config.json')

const fetchLibraries = async (setLibraries) => {
    const server_location = config.server_address
    try {
        const response = await fetch(`${server_location}/libraries`)
        console.log('connected to: ', config.server_address)
        const data = await response.json()
        setLibraries(data)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}

export const Home = (props) => {

    const [libraries, setLibraries] = React.useState(void 0)

    React.useEffect(() => {
        fetchLibraries(setLibraries)
    }, [setLibraries])

    console.log('libraries found: ', libraries)

    return <div>
        This is some text
    </div>
}