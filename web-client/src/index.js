import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './home'
import "./styles.css";

addEventListener("resize", (event) => {
    const photoGrid = document.getElementsByClassName('photoGrid')[0]
    if (photoGrid) {
        photoGrid.style.paddingLeft = ((window.innerWidth - 20) % 220) / 2 + 10 + 'px'
    }
});

// Render your React component instead
const root = createRoot(document.getElementById('root'))
root.render(<Home />)
