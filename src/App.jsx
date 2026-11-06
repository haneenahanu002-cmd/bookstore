
import './App.css'

import { useEffect, useState, useContext } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Footer from './components/Footer'
import Preloading from './components/Preloading.jsx'
import Userheader from './user/components/Userheader'
import Pnf from './pages/pnf.jsx'
import Home from './user/pages/Home'
import ViewBook from './user/pages/ViewBook'
import Allbooks from './user/pages/Allbooks'
import Contact from './user/pages/Contact'
import Profile from './user/pages/Profile'
import Payementfail from './user/pages/Payementfail'
import Payemntsuccess from './user/pages/Payemntsuccess'

import Authentication from './pages/Authentication'

import Dashboard from './admin/pages/Dashboard'
import Resource from './admin/pages/Resource'
import Settings from './admin/pages/Settings'

import { routerContext } from './context/RouterGuardContext.jsx'

function App() {
  const { role } = useContext(routerContext)

  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const isAdminPage = location.pathname.startsWith('/admin')

  if (loading) {
    return <Preloading />
  }

  return (
    <>
      {location.pathname === '/' && <Userheader />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Authentication register={false} />}
        />

        <Route
          path="/signup"
          element={<Authentication register={true} />}
        />

        <Route path="/all-books" element={<Allbooks />} />
        <Route path="/Contact" element={<Contact />} />

        {/* User Routes */}
        <Route
          path="/profile"
          element={
            role === 'user' ? <Profile /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/view-book/:id"
          element={
            role === 'user' ? <ViewBook /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/success"
          element={
            role === 'user' ? <Payemntsuccess /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/fail"
          element={
            role === 'user' ? <Payementfail /> : <Navigate to="/login" />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            role === 'admin' ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/admin-resource"
          element={
            role === 'admin' ? <Resource /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/admin-settings"
          element={
            role === 'admin' ? <Settings /> : <Navigate to="/login" />
          }
        />

        {/* Page Not Found */}
        <Route path="*" element={<Pnf />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

      {!isAdminPage && <Footer />}
    </>
  )
}

export default App
