import * as React from 'react'
import InfoIcon from '../assets/info.svg'

export const PhotoModal = (props) => {

    const { photo, setPhoto } = props

    return <div className='modalContainer'>
        <div className='modalBG' onClick={() => { setPhoto(void 0) }}></div>
        <div className='photoViewer' style={{backgroundImage: photo}}>
            <InfoIcon />
        </div>
    </div>
}
