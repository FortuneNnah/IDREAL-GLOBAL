import React from 'react'
import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'


const ContactPage = () => {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    function submit(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (!data.get('name'))
            return setError('Please enter your name.');
        if (!/^\S+@\S+\.\S+$/.test(data.get('email')))
            return setError('Please enter a valid email address.');
        if (!data.get('subject')) return setError('Please enter a subject.');
        if (!data.get('reason')) return setError('Please select a reason for contacting us.');
        if (!data.get('message')) return setError('Please enter your message.'); setError(''); setSent(true)
    }
    return (
        <>
            <Header />
            <main className="contact-page">
                <div className="page-intro">
                    <p className="eyebrow">CUSTOMER SUPPORT</p>
                    <h1>Contact Us</h1>
                    <p>Have a question, need assistance, or require additional information? Our team is available to assist you.</p>
                </div>
                <div className="contact-layout">
                    <section className="contact-info">
                        <h2>We are here to help.</h2>
                        <Info title="Customer Support" value="support@yourdomain.com" />
                        <Info title="General Enquiries" value="info@yourdomain.com" />
                        <Info title="Phone" value="+234 XXX XXX XXXX" />
                        <Info title="Company Headquarters" value="Lagos, Nigeria" />
                    </section>
                    <section className="contact-form">
                        {sent ? (
                            <div className="success-box">
                                <h2>Message Sent Successfully</h2>
                                <p>Thank you for contacting us. Our team will review your message and respond as soon as possible.</p>
                                <a className="primary" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
                                    Return to Home
                                </a>
                            </div>
                        ) : (
                            <form className="form-stack" onSubmit={submit}>
                                <Field label="Full Name" name="name" />
                                <Field label="Email Address" name="email" type="email" />
                                <Field label="Phone Number" name="phone" />
                                <Field label="Subject" name="subject" />
                                <label>
                                    Reason for Contact
                                    <select name="reason">
                                        <option value="">Select a reason</option>
                                        <option>General Enquiry</option>
                                        <option>Job Seeker Support</option>
                                        <option>Employer Support</option>
                                        <option>Technical Support</option>
                                        <option>Partnership</option>
                                        <option>Feedback</option>
                                        <option>Report a Job Listing</option>
                                        <option>Other</option>
                                    </select>
                                </label>
                                <label>
                                    Message
                                    <textarea name="message" rows="5" />
                                </label>
                                {error && (
                                    <p className="form-error" role="alert">
                                        {error}
                                    </p>
                                )}
                                <button className="primary" type="submit">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default ContactPage