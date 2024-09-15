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

const createLibrary = async (libraryOptions, server_location, setCreatingLibrary) => {
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
        const data = await response.json()
        console.log('complete!', data)
        setCreatingLibrary(void 0)
    } catch {
        console.log('failed to connect: ', server_location)
    }
}


export const CreateLibraryModal = (props) => {

    const { setCreatingLibrary, serverLocation } = props

    const [libraryOptions, setLibraryOptions] = React.useState(void 0)
    const [selectedParent, selectParent] = React.useState(void 0)
    const [inputtedInformation, setInputtedInformation] = React.useState({
        location: '',
        name: '',
        description: '',
    })


    React.useEffect(() => {
        fetchLibraryOptions(setLibraryOptions, serverLocation)
    }, [setLibraryOptions])

    console.log(libraryOptions)

    return <div className='modalContainer'>
        <div className='modalBG'></div>
        <div className='modalForm'>
            {
                libraryOptions ? <>
                <h1>Create Library</h1>
                <h4>Choose a location</h4>
                {
                    libraryOptions.locations.map(location => {
                    return <div className={`buttonPrimary ${selectedParent === location ? 'blueButton' : ''}`} onClick={() => { selectParent(location) }} key={location}>
                            {location}
                        </div>
                    })
                }
                {/* <div className={`buttonPrimary ${selectedParent === 'newParent' ? 'blueButton' : ''}`} onClick={() => { selectParent('newParent') }}>
                    + Create New Location
                </div> */}
                <h4>Library Folder</h4>
                <input type="text" placeholder='LibraryFolder' className='textBox' onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        location: e.target.value,
                    })
                }}></input>
                <h4>Library Name</h4>
                <input type="text" placeholder='Library Name' className='textBox' onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        name: e.target.value,
                    })
                }}></input>
                <h4>Description</h4>
                <textarea placeholder='Library description.' className='textBox' onBlur={(e) => {
                    setInputtedInformation({
                        ...inputtedInformation,
                        description: e.target.value,
                    })
                }}></textarea>
                <div className='modalBottomButtons'>
                    <div className='buttonPrimary blueButton' onClick={() => { createLibrary({...inputtedInformation, libraryParent: selectedParent}, serverLocation, setCreatingLibrary) }}>Create Library</div>
                    <div className='buttonPrimary redButton' onClick={() => { setCreatingLibrary(void 0) }}>Cancel</div>
                </div>
                </> : ''
            }
        </div>
    </div>
}