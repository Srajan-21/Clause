import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../Context/UserContext'
import axios from 'axios'

const UserProtectedWrapper = ({children}) => {

    
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)
 

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/users/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profileUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data.data.user)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/users/login')
            })
        }, [ token , navigate , setUser])

        if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

        return (
            <>
                {children}
            </>
        )
}

export default UserProtectedWrapper
