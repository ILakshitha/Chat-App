import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';


const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();

  }, [checkAuth])

  console.log(user);

  if (isCheckingAuth && !user) return (<div className='flex justify-center items-center h-screen'>
<Loader className='animate-spin size-10' />
  </div>);

  return (

    <div >

      <Navbar />
      <Routes>
        <Route path="/" element={user?<HomePage />: <Navigate to="/login"/>} />
        <Route path="/signup" element={!user?<SignUpPage />:<Navigate to="/"/>} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/setting" element={<SettingPage />} />

        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </div>
  )
}

export default App
