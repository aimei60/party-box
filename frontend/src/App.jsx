import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/homepage'
import Shop from './pages/shop'
import Faq from './pages/faq'
import Contact from './pages/contact'
import About from "./pages/about";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;