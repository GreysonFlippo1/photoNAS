import * as React from 'react'
import { LibraryView } from './tabs/libraryview'
import { CreateLibraryModal } from './tabs/create_library_modal'
import { EditLibraryModal } from './tabs/edit_library_modal'
import InfoIcon from './assets/info.svg'

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

const scrollTo = (location) => {
    window.scroll({
        top: location ?? document.getElementsByClassName('librariesGrid')[0].clientHeight + 120,
        left: 0,
        behavior: "smooth",
      })
}

const Libraries = (props) => {

    const {libraries, setLibrary, serverLocation} = props

    return <>
        {libraries.map(library => {
            const preview = library.preview[0]
        
            return <div key={library.path} className='libraryCard' onClick={() => { setLibrary(library); setTimeout(scrollTo, 100)}}>
                {preview && <div className='libraryBG' style={{backgroundImage: `url("${serverLocation}/library/${library.name}/${preview}")`}}></div>}
                <div className='libraryGradient'></div>
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
    const [creatingLibrary, setCreatingLibrary] = React.useState(void 0)
    const [editingLibrary, setEditingLibrary] = React.useState(void 0)

    React.useEffect(() => {
        !creatingLibrary && fetchLibraries(setLibraries)
    }, [setLibraries, creatingLibrary])

    return <>
        <div className='header'>
            <div className='headerTitleRow'>
                <h1>Libraries</h1>
                <div className='buttonPrimary' onClick={() => { setCreatingLibrary(true) }}>Create Library</div>
            </div>
        </div>
        <div className='librariesGrid'>
        {
            libraries && libraries.length ?
                <Libraries libraries={libraries} setLibrary={setLibrary} serverLocation={config.server_address} /> 
                : <h1>{`No Libraries Found :(`}</h1>
        }
        </div>
        <>
        {
            selectedLibrary ? <>
                <div className='header libraryHeader'>
                    <div className='headerTitleRow'>
                        <h1>
                            {selectedLibrary.name}
                        </h1>
                        <div className='buttonPrimary' onClick={() => { setEditingLibrary(true) }}>Edit Library</div>
                    </div>
                    <h3 style={{marginTop: 0}}>{selectedLibrary.info.description}</h3>
                    <div className='infoTable'>
                        <h6>{selectedLibrary.info.photoCount ?? 0} Images</h6>
                        <h6>&#183;</h6>
                        <h6>{selectedLibrary.info.videoCount ?? 0} Videos</h6>
                        <h6>&#183;</h6>
                        <h6>Created {selectedLibrary.info.created}</h6>
                        <h6>&#183;</h6>
                        <h6>Updated {selectedLibrary.info.updated ?? selectedLibrary.info.created}</h6>
                        <h6>&#183;</h6>
                        <h6><InfoIcon /></h6>
                    </div>
                </div>
                <LibraryView libraryName={selectedLibrary.name} serverLocation={config.server_address} photo_formats={config.photo_formats} />
                </> : ''
        }
        </>
        { creatingLibrary ? <CreateLibraryModal setCreatingLibrary={setCreatingLibrary} serverLocation={config.server_address} /> : ''}
        { editingLibrary ? <EditLibraryModal setEditingLibrary={setEditingLibrary} serverLocation={config.server_address} selectedLibrary={selectedLibrary ?? {}} /> : ''}
    </>
}
