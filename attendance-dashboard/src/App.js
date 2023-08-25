import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Events from './pages/Events';
import { Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import EventDetails from './pages/EventDetails';
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import AttendanceMap from './pages/Map';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const { decodedToken, isExpired } = useJwt(cookies.token);

  if (cookies.token && !isExpired) {
    return (
      <Routes>
        <Route path='/' element={<Events />} />
        <Route path='/users' element={<Users />} />
        <Route path='/event-details/:id' element={<EventDetails />} />
        <Route path='/map' element={<AttendanceMap/>}/>
      </Routes>
    );
  } else {
    return (
      <Login />
    );
  }
}

export default App;
