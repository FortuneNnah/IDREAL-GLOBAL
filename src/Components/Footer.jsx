import React from 'react'

const Footer = () => {
    const date = new Date()
    return (
    <footer>
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
            <span className="brand-mark">ID</span><span>IDREAL</span>
        </a>
        <span>© {date.getFullYear()} Aperture Careers</span>
        <div>
            <a href="/jobs" onClick={(e) => { e.preventDefault(); navigate('/jobs') }}>Find Jobs</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact') }}>Contact</a>
            <a href="/#resources" onClick={(e) => { e.preventDefault(); navigate('/#resources') }}>Privacy</a>
            <a href="/#resources" onClick={(e) => { e.preventDefault(); navigate('/#resources') }}>Terms</a>
        </div>
    </footer>
)}

export default Footer