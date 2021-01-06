import React from 'react';
import Layout from './layout'
import { useSelector } from 'react-redux'
import Login from './pages/login'
import checkPlatform from './utils/checkPlatform'

function App() {
  checkPlatform()
  const role = useSelector(state => state.login.role)

  return role ? <Layout /> : <Login />
}

export default App;
