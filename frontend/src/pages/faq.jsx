import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import '../css/faq.css'

function Faq() {
    return (
        <>
        <Navbar/>
        <div className="faq">
            <div className="faq-inner">
                <div className="faq-title">FAQ</div>
                <div className="faq-description">
                    <div className="question-box">General</div>
                    <div className="questions">
                        <strong>What is a party box?</strong><br />
                        Our party boxes are professionally printed and already pre-folded. Just pop them open, push the base together, and they’re ready to go! They take seconds to assemble and are perfect for filling with treats or small gifts to match your party theme.
                        <br /><br />
                        <strong>Do I buy directly from this website?</strong><br />
                        All purchases are made securely through our Etsy shop. You can browse our boxes here on the site and click “Shop on Etsy” when you're ready to order.
                        <br /><br />
                        <strong>Who are these boxes for?</strong><br />
                        They’re great for children’s parties, birthdays, playdates, classroom celebrations, or any fun little event!
                        <br /><br />
                        <strong>What size are the boxes?</strong><br />
                        Each box is approximately 17.5 cm (6.8 inches) tall, 13.5 cm (5.3 inches) long, and 10.9 cm (4 inches) wide. Perfect for small toys, sweets, and party favours.
                    </div>
                    <div className="question-box">Orders & Delivery</div>
                    <div className="questions">
                        <strong>How long will delivery take?</strong><br />
                        All orders are processed through Etsy. Delivery estimates and shipping options are shown on each product listing.
                        <br /><br />                 
                        <strong>Do you ship internationally?</strong><br />
                        Yes, we offer worldwide shipping! You’ll find the available shipping options on our Etsy shop.
                        <br /><br />
                        <strong>How are the boxes packaged for delivery?</strong><br />
                        Boxes are shipped flat in protective packaging to keep them safe, clean, and crease-free during delivery.
                    </div>
                    <div className="question-box">Products & Quality</div>
                    <div className="questions">
                        <strong>What’s included in a party box?</strong><br />
                        Each box comes professionally printed, pre-folded, and ready to pop open. Just press the base together and fill it with treats! Every box features the theme you selected and arrives flat-packed for easy shipping.
                        <br /><br />
                        <strong>What are your prices?</strong><br />
                        Each box is £2.00, including custom designs.
                        <br /><br />
                        <strong>Are your products eco-friendly?</strong><br />
                        Yes! Our boxes are recyclable and printed on high-quality 260gsm photo paper.
                    </div>
                    <div className="question-box">Customization & Design</div>
                    <div className="questions">
                        <strong>Can I personalise a box with my child’s name or a message?</strong><br />
                        Absolutely! We offer personalisation on many designs. Just send us a message on Etsy or through our contact page, and we’ll let you know what we can do. We can create custom messages for any occasion.
                        <br /><br />
                        <strong>Can I customize a box?</strong><br />
                        Yes! If you’d like something personalised, just send us a message. If it’s something we can do (and we have the time), we’ll happily create it for you.
                        <br /><br />
                        <strong>Do you create new themes?</strong><br />
                        Yes! We’re always working on new ideas and adding fresh designs. Keep an eye on our Etsy shop for the latest releases.
                    </div>
                    <div className="question-box">Contact & Support</div>
                    <div className="questions">
                        <strong>I have another question!</strong><br />
                        No problem at all. Feel free to reach out through our contact form or message us directly on Etsy.
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Faq;