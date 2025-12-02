import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Banner from "../components/banner";
import '../css/homepage.css'

function Homepage() {
    return (
        <>
        <Navbar/>
        <Banner/>
        <h1>welcome to the homepage</h1>
        <Footer/>
        </>
    );

}

export default Homepage;