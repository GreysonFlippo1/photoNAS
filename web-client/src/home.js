import * as React from 'react'
import { LibraryView } from './tabs/libraryview'

const config = require('../config.json')

const fetchLibraries = async (setLibraries) => {
    const server_location = config.server_address
    try {
        const response = await fetch(`${server_location}/libraries?preview=1`)
        const data = await response.json()
        setLibraries(data)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}

const Libraries = (props) => {

    const {libraries, setLibrary, serverLocation} = props

    return <>
        {libraries.map(library => {
            const preview = library.preview[0]
        
            return <div key={library.path} className='libraryCard' onClick={() => { setLibrary(library) }}>
                {preview && <div className='libraryBG' style={{backgroundImage: `url("${serverLocation}/library/${library.name}/${preview}")`}}></div>}
                <div className='libraryInfo'>
                    {library.name}
                </div>
            </div>
        })}
    </>
}

export const Home = () => {

    const [libraries, setLibraries] = React.useState(void 0)
    const [selectedLibrary, setLibrary] = React.useState(void 0)

    React.useEffect(() => {
        fetchLibraries(setLibraries, setLibrary)
    }, [setLibraries])

    return <>
        <>
        <div className='header'>
            <h1>Libraries</h1>
        </div>
        {
            libraries && libraries.length ?
                <div className='librariesGrid'>
                    <Libraries libraries={libraries} setLibrary={setLibrary} serverLocation={config.server_address} /> 
                </div> : 'No Libraries Found :('
        }
        </>
        <>
        {
            selectedLibrary ? <>
                <div className='header libraryHeader'>
                    <h1>{selectedLibrary.name}</h1>
                    <h3>{selectedLibrary.info.description}</h3>
                    <div className='infoTable'>
                        <h6>Created {selectedLibrary.info.created}</h6>
                        <h6>&#183;</h6>
                        <h6>Updated {selectedLibrary.info.updated ?? selectedLibrary.info.created}</h6>
                        <h6>&#183;</h6>
                        <h6>Location {selectedLibrary.path}</h6>
                    </div>
                </div>
                <LibraryView libraryName={selectedLibrary.name} serverLocation={config.server_address} photo_formats={config.photo_formats} />
                </> : ''
        }
        </>
    </>
}
