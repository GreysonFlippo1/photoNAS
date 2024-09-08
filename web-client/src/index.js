import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './home'

// Render your React component instead
const root = createRoot(document.getElementById('root'))
root.render(<Home />)