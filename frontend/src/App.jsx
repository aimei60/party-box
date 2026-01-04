import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NavbarLayout from "./navbarlayout";
import Homepage from './pages/homepage'
import Shop from './pages/shop'
import Faq from './pages/faq'
import Contact from './pages/contact'
import About from "./pages/about";
import ProductPage from "./pages/product";
import AdminLogin from "./pages/login";
import './css/app.css'


function App() {
  const [searchText, setSearchText] = useState("")

  return (
    <Router>
      <Routes>
        <Route 
          element={<NavbarLayout searchText={searchText} setSearchText={setSearchText} />} >
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop searchText={searchText} />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/login" element={<AdminLogin />} />
        {/*<Route path="/dashboard" element={<Dashboard />} />*/}
      </Routes>
    </Router>
  );
}

export default App;