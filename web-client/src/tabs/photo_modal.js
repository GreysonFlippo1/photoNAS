import * as React from 'react'

export const PhotoModal = (props) => {

    const { photo, setPhoto } = props
    console.log(photo)

    return <div className='modalContainer'>
        <div className='modalBG' onClick={() => { setPhoto(void 0) }}></div>
        <div className='photoViewer' style={{backgroundImage: photo}}></div>
    </div>
}