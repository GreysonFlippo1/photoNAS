import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
    // ErrorComponent,
    RouterProvider,
    createRouter,
    createRootRoute,
    createRoute
  } from '@tanstack/react-router'
import { Home } from './home'
import { Login } from './login'
import './styles.css';

const rootRoute = createRootRoute()

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'login',
    component: Login,
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

// Create a new router instance
const router = createRouter({ routeTree })

addEventListener('resize', (event) => {
    const photoGrid = document.getElementsByClassName('photoGrid')[0]
    if (photoGrid) {
        photoGrid.style.paddingLeft = ((window.innerWidth - 20) % 220) / 2 + 10 + 'px'
    }
});

// Render your React component instead
const root = createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)
