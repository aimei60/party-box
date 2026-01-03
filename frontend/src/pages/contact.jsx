import Footer from "../components/footer";
import '../css/contact.css'

function Contact() {
    return (
        <>
        <div className="contact-container">
            <div className="contact-inner-container">
                <h2 className="contact-title">Contact</h2>
                <div className="contact-box">
                    <p className="contact-subtitle">Got a question or a custom query? Message us!</p>
                    <p className="extra-info">We aim to respond to all emails within 48 hours but at busy times this may take a little longer.</p>
                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" placeholder="you@example.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" placeholder="Write your message..." required />
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )

}

export default Contact;