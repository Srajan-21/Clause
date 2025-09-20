import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../Context/UserContext'
import axios from 'axios'

const UserSignup = () => {

  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [fullName , setFullName] = useState('')

  const navigate = useNavigate()

  const {user , setUser} = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()

    const newUser = {
      fullName : fullName,
      email : email , 
      password : password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/registerUser` , newUser)

    if(response.status === 201){
      console.log(response.data)
      const data = response.data.data
      setUser(data.user)
      localStorage.setItem('token' , data.token)
      navigate('/')
    }

    setFullName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div >
      <div>

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>

          <h3 className='text-lg font-medium w-1/2 mb-2'>
            What's your name
          </h3>

          <input 
            type='text' 
            value = {fullName}
            onChange = {(e) => {
              setFullName(e.target.value)
            }}
            className=' rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base'
            placeholder='Full Name' 
            required
          />

          <h3 className='text-lg font-medium w-1/2 mb-2'>
            What's your email
          </h3>

          <input 
            type='email' 
            value = {email}
            onChange = {(e) => {
              setEmail(e.target.value)
            }}
            className=' mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            placeholder='Email' 
            required
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input 
            value = {password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            className=' mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type='password' 
            placeholder='Enter password' 
            required
          />

          <button
            className=' text-white bg-amber-900 font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>
            Create Account
          </button>

        </form>

        <p 
        className='text-center'>
          Already have an account? 
          <Link 
          to='/users/login' 
          className='text-blue-600'>
            Login here
          </Link>
        </p>

      </div>

      <div className='text-center'>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      
    </div>
  )
}

export default UserSignup
