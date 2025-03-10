import {createRoot} from 'react-dom/client'
import {ThemeProvider} from "styled-components"

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={{}}>
        <App/>
    </ThemeProvider>
)
