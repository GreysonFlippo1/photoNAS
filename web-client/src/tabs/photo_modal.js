import * as React from 'react'
import InfoIcon from '../assets/info.svg'
import ExitIcon from '../assets/exit.svg'

export const PhotoModal = (props) => {

    const { photo, setPhoto } = props

    const [showingInfo, setShowingInfo] = React.useState(false)

    return <div className='modalContainer'>
        <div className='modalBG' onClick={() => { setPhoto(void 0) }}></div>
        <div className='photoViewer' style={{backgroundImage: photo}}>
            <div className="photoContainer">
                <img src={photo} />
            </div>
            {
                showingInfo ?
                    <div className='photoInfo'>
                        title: bing bong
                    </div> :
                    void 0
            }
            <ExitIcon callback={() => { setPhoto(void 0) }}/>
            <InfoIcon callback={() => { setShowingInfo(!showingInfo) }}/>
        </div>
    </div>
}
