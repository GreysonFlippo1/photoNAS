import * as React from 'react'
import { LibraryView } from './tabs/libraryview'
import { filterFiles } from './common_funtions'

const config = require('../config.json')

const fetchLibraries = async (setLibraries) => {
    const server_location = config.server_address
    try {
        const response = await fetch(`${server_location}/libraries?preview=2`)
        const data = await response.json()
        setLibraries(data)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}

const Libraries = (props) => {

    const {libraries, setLibrary, photo_formats, serverLocation} = props

    return <>
        {libraries.map(library => {
            const preview = filterFiles(library.preview, photo_formats)[0]
        
            return <div key={library.path} className='libraryCard' onClick={() => { setLibrary(library.name) }}>
                {preview && <div className='libraryBG' style={{backgroundImage: `url("${serverLocation}/library/${library.name}/${preview}")`}}></div>}
                <div className='libraryInfo'>
                    {library.name}
                    {/* Path: {library.path} <br/>
                    Desc: {library.info.description ?? 'None'} <br/>
                    Created: {library.info.created} <br/> */}
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

    console.log(libraries)

    return <>
        <>
        {
            libraries && libraries.length ?
                <div className='librariesGrid'>
                    <Libraries libraries={libraries} setLibrary={setLibrary} photo_formats={config.photo_formats} serverLocation={config.server_address} /> 
                </div> : 'No Libraries Found :('
        }
        </>
        <>
        {
            selectedLibrary ? <>
                <LibraryView libraryName={selectedLibrary} serverLocation={config.server_address} photo_formats={config.photo_formats} />
                </> : ''
        }
        </>
    </>
}