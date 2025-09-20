import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserDataContext } from './Context/UserContext'
import UserLogin from './components/Pages/Login.Page'
import UserSignup from './components/Pages/Signup.Page'
import Home from './components/Pages/Home.Page'
import UserLogout from './components/Pages/Logout.Page'
import UserProtectedWrapper from './components/Pages/UserProtectedWrapper'

const App = () => {

  const ans = useContext(UserDataContext)
  console.log(ans)

  return (
    <div >
     <Routes>
      <Route path = '/users/login' element = {<UserLogin/>}/>
      <Route path = '/users/signup' element = {<UserSignup/>}/>
      

      <Route path = '/' element = {
        <UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>
      }/>

      <Route path = '/users/logout' element = {
        <UserProtectedWrapper>
          <UserLogout/>
        </UserProtectedWrapper>
      }/>

     </Routes>
    </div>
  )
}

export default App
