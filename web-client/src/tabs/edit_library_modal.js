import * as React from 'react'

const fetchLibraryOptions = async (setLibraryOptions, server_location) => {
    try {
        const response = await fetch(`${server_location}/create/library`, { method: 'GET' })
        const data = await response.json()
        setLibraryOptions(data)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}

const createLibrary = async (libraryOptions, server_location, setEditingLibrary) => {
    const formattedData = {
        libraryParent: libraryOptions.libraryParent,
        location: libraryOptions.location,
        data: {
            name: libraryOptions.name,
            description: libraryOptions.description
        }
    }
    console.log(JSON.stringify(formattedData))
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const response = await fetch(`${server_location}/create/library`, {
            method: 'post',
            body: JSON.stringify(formattedData),
            headers,
        })
        await response.json()
        console.log('complete!')
        setEditingLibrary(void 0)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}


export const EditLibraryModal = (props) => {

    const { setEditingLibrary, serverLocation, selectedLibrary } = props
    console.log(selectedLibrary)

    const [libraryOptions, setLibraryOptions] = React.useState(void 0)
    const [selectedParent, selectParent] = React.useState(selectedLibrary.location.name)
    const [inputtedInformation, setInputtedInformation] = React.useState({
        location: selectedLibrary.location.path,
        name: selectedLibrary.name,
        description: selectedLibrary.info.description,
    })


    React.useEffect(() => {
        fetchLibraryOptions(setLibraryOptions, serverLocation)
    }, [setLibraryOptions])
    console.log(libraryOptions?.locations)

    return <div className='modalContainer'>
        <div className='modalForm'>
            {
                libraryOptions ? <>
                <h1>Edit Library</h1>
                <h4>Change location</h4>
                {
                    libraryOptions.locations.map(location => {
                    return <div className={`buttonPrimary ${selectedParent === location ? 'greenButton' : ''}`} onClick={() => { selectParent(location) }} key={location}>
                            {location}
                        </div>
                    })
                }
                {/* <div className={`buttonPrimary ${selectedParent === 'newParent' ? 'greenButton' : ''}`} onClick={() => { selectParent('newParent') }}>
                    + Create New Location
                </div> */}
                <h4>Library Folder</h4>
                <input type="text" placeholder='LibraryFolder' className='textBox' defaultValue={inputtedInformation.location} onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        location: e.target.value,
                    })
                }}></input>
                <h4>Library Name</h4>
                <input type="text" placeholder='Library Name' className='textBox' defaultValue={inputtedInformation.name} onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        name: e.target.value,
                    })
                }}></input>
                <h4>Description</h4>
                <textarea placeholder='Library description.' className='textBox' defaultValue={inputtedInformation.description} onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        description: e.target.value,
                    })
                }}></textarea>
                <div className='modalBottomButtons'>
                    <div className='buttonPrimary greenButton' onClick={() => { createLibrary({...inputtedInformation, libraryParent: selectedParent}, serverLocation, setCreatingLibrary) }}>Save Changes</div>
                    <div className='buttonPrimary redButton' onClick={() => { setEditingLibrary(void 0) }}>Cancel</div>
                </div>
                </> : ''
            }
        </div>
    </div>
}