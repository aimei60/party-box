import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { IoHeart } from "react-icons/io5";
import '../css/about.css'

function About() {
    return (
        <>
        <div className="about">
            <div className="about-inner">
                <div className="about-title">Our Story</div>
                <div className="about-description">
                    Every celebration should feel magical and without the stress. At Zogy Studios, I’m all about making birthdays easy, fun, and full of smiles for kids and parents alike.
                    <br /><br />
                    It all started while I was planning my niece’s 4th birthday. I couldn’t find a party box that felt right; something themed, exciting, and ready to go. So I designed one myself. Soon friends started asking for their own, and that’s how Zogy Studios was born.
                    <br /><br />
                    Today, every box is made with care, personalised to each child, and crafted from recyclable materials using premium 260gsm photo paper. I put time, attention, and genuine joy into every order{" "}<IoHeart className="about-heart" /> 
                    <br /><br />
                    Because every child deserves a day that feels special and every parent deserves one that feels easy.
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )

}

export default About;