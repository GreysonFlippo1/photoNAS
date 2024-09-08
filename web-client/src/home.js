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

const Libraries = (props) => {

    return <div>
        {props.libraries.map(library => {
            return <div key={library.path}>
                Name: {library.name} <br/>
                Path: {library.path} <br/>
                Desc: {library.info.description ?? 'None'} <br/>
                Created: {library.info.created} <br/>
            </div>
        })}
    </div>
}

export const Home = () => {

    const [libraries, setLibraries] = React.useState(void 0)

    React.useEffect(() => {
        fetchLibraries(setLibraries)
    }, [setLibraries])

    console.log('libraries found: ', libraries)

    return <div>
        {
            libraries && libraries.length ? <Libraries libraries={libraries}/> : 'No Libraries Found :('
        }
    </div>
}