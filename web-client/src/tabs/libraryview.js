import * as React from 'react'
import { PhotoModal } from './photo_modal'

const fetchLibrary = async (setLibrary, libraryName, server_location) => {
    try {
        const response = await fetch(`${server_location}/library/${libraryName}`)
        const data = await response.json()
        setLibrary(data)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}

const Photos = (props) => {

    const {files, libraryName, serverLocation, photo_formats, setPhoto} = props

    const photos = files

    return <>
        {photos.map(photo => {
            return <div
                    key={photo}
                    className='photoSquare'
                    style={{backgroundImage: `url("${serverLocation}/library/${libraryName}/${photo}")`}}
                    onClick={() => {setPhoto(`url("${serverLocation}/library/${libraryName}/${photo}")`)}}>
                </div>
        })}
    </>
}

export const LibraryView = (props) => {

    const {libraryName, serverLocation, photo_formats} = props

    const [library, setLibrary] = React.useState(void 0)
    const [photo, setPhoto] = React.useState(void 0)

    React.useEffect(() => {
        fetchLibrary(setLibrary, libraryName, serverLocation)
    }, [setLibrary, libraryName, serverLocation])

    const loading = library?.info.name !== libraryName

    return <>
        <div className='photoGrid'>
        {
            (library && !loading) ? <Photos files={library.files} libraryName={libraryName} serverLocation={serverLocation} photo_formats={photo_formats} setPhoto={setPhoto} /> : ''
        }
        </div>
        {
            photo ? <PhotoModal photo={photo} setPhoto={setPhoto} /> : <></>
        }
    </>
}