import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from './pages/homepage'
import Shop from './pages/shop'
import Faq from './pages/faq'
import Contact from './pages/contact'
import About from "./pages/about";
import './css/app.css'


function App() {
  const [searchText, setSearchText] = useState("")

  return (
    <Router>
       <Navbar searchText={searchText} setSearchText={setSearchText} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop searchText={searchText} />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;