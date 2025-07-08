import Body from './components/Body'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './components/Login'
import Profile from './components/Profile'
// import { store } from './app/store'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Feed from './components/Feed'
import Requests from './components/Requests' 
import Connections from './components/Connections'

function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter baseName="/">
          <Routes>
            <Route path='/' element={<Body />}>
              <Route path='/' element={<Feed />}/>
                <Route path='/login/*' element={<Login />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/connections' element={<Connections/>}/>
                <Route path='/requests' element={<Requests/>}/>
              </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

