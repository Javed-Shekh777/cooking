import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux"
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Route.jsx'
import store from './store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  </Provider>
  ,
)
