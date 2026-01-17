import { useState } from "react";
import Footer from "../components/footer";
import '../css/contact.css'

function Contact() {
    const [status, setStatus] = useState("standby")
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitted(true)
        setStatus("sending")

        const form = e.currentTarget; 
        const formData = new FormData(form);
        const formspree_endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

        try {
            const res = await fetch(formspree_endpoint, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            if (res.ok) {
                form.reset();
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <>
        <div className="contact-container">
            <div className="contact-inner-container">
                <h2 className="contact-title">Contact</h2>
                <div className="contact-box">
                    <p className="contact-subtitle">Got a question or a custom query? Message us!</p>
                    <p className="extra-info">We aim to respond to all emails within 48 hours but at busy times this may take a little longer.</p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input type="hidden" name="_subject" value="ZogyStudios: New message from customer" />
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
                        <button className="submit-btn" disabled={status === "sending"}>
                            {status === "sending" && "Sending..."}
                            {status !== "sending" && "Send Message"}
                        </button>
                        {submitted && status === "success" && (<p className="contact-success">Thanks! Your message has been sent.</p>)}
                        {submitted && status === "error" && (<p className="contact-error">Something went wrong. Try again!</p>)}
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Contact;