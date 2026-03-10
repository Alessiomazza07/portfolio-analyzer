import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx'
import Signin from './pages/signin.jsx'
import Signup from './pages/signup.jsx'
import CreatePortfolio from './pages/createPortfolio.jsx'
import Dashboard from './pages/dashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/create" element={<CreatePortfolio/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
