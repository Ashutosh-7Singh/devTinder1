import Body from './Body'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './Login'
import Profile from './Profile'
function App() {

  return (
    <>
      <BrowserRouter baseName="/">
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

