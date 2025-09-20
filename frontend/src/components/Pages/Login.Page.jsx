import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../Context/UserContext'
import axios from 'axios'

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password , setPassword] = useState('')

  const {user , setUser} = useContext(UserDataContext)
  const navigate = useNavigate()

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) navigate('/')
  }, [navigate])


  const submitHandler = async(e) => {
    e.preventDefault()
    
    const userData = {
      email : email,
      password : password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/loginUser` , userData)

    if(response.status === 200){
      console.log(response.data)
      setUser(response.data.data.user)
      localStorage.setItem('token' , response.data.data.token)
      navigate('/')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div >
      <div>

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>

          <input 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            type='email' 
            className='rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base'
            placeholder='email@example.com' 
            required
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            className=' rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base'
            type='password' 
            placeholder='Enater password' 
            required
          />

          <button
            className='  mb-7 bg-amber-900 text-white font-semibold px-4 py-2 border w-full text-lg placeholder:text-base'>
            Login
          </button>

        </form>

        <p 
        className='text-center'>
          New here? 
          <Link 
          to='/users/signup' 
          className='text-blue-600'>
            Create new Account
          </Link>
        </p>

      </div>

      
      
    </div>
    
  )
}

export default UserLogin
