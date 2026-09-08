import { useState } from 'react'
import navigate from './Navigate'

function Header() {
    const [open, setOpen] = useState(false)
    return (
        <header className="header">
            <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
                <span className="brand-mark">ID</span><span>IDREAL GLOBAL CONSULT</span>
            </a>
            <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
            <nav className={open ? 'nav open' : 'nav'}>
                <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
                <a href="/jobs" onClick={(e) => { e.preventDefault(); navigate('/jobs') }}>Find Jobs</a>
                <a href="/#resources" onClick={(e) => { e.preventDefault(); navigate('/#resources') }}>Career Resources</a>
                <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact') }}>Contact</a>
            </nav>
            <div className="header-actions">
                <a className="text-button" href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin') }}>Sign in</a>
                <a className="primary small" href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup') }}>Create account</a>
            </div>
        </header>
    )
}

export default Header