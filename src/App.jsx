import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx'
import About from './pages/about.jsx'
import Signin from './pages/signin.jsx'
import Signup from './pages/signup.jsx'
import Account from './pages/account.jsx'
import Create from './pages/create.jsx'
import Portfolios from './pages/portfolios.jsx'
import Dashboard from './pages/dashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/portfolios" element={<Portfolios/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
