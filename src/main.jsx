import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import SearchContext from './context/SearchContext.jsx'
import RouterGuardContext from './context/RouterGuardContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <GoogleOAuthProvider clientId="190479884661-cis5ln9g6qoqao1urjfhemogpt4jkbri.apps.googleusercontent.com"> 
     <SearchContext>
      <RouterGuardContext>
        <App />
      </RouterGuardContext>
      </SearchContext>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)