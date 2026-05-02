import React, { useEffect, useState, useContext } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { getRequest } from '../Helpers'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../Hooks/cookie'
import { AppContext } from '../Context/AppContext'
import Cookies from 'js-cookie'

const DefaultLayout = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const { setUser } = useContext(AppContext)

  useEffect(() => {
    const token = Cookies.get('solarToken')
    setUserData(token)

    getRequest(`auth/profile`)
      .then((res) => {
        setUser(res?.data?.data)
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          deleteCookie('solarToken')
          deleteCookie('UserId')
          navigate('/login')
        } else if (error.response?.status >= 500) {
          navigate('/500')
        } else {
          console.log('error', error)
        }
      })
  }, [navigate])

  return (
    <div>
      <AppSidebar userData={userData} />
      <div
        style={{ zIndex: 1, position: 'relative' }}
        className="wrapper d-flex flex-column min-vh-100"
      >
        <AppHeader userData={userData} />
        <div className="flex-grow-1">
          <AppContent userData={userData} />
        </div>
        <AppFooter userData={userData} />
      </div>
    </div>
  )
}

export default DefaultLayout
