import Header from './Header'
import Footer from './Footer'
import navigate from './Navigate'


function AuthLayout({ title, children, alternate, alternateHref, alternateLabel }) {
    return (
        <>
            <Header />
            <main className="auth-page">
                <section className="auth-card">
                    <p className="eyebrow">IDREAL GLOBAL CONSULT</p>
                    <h1>{title}</h1>
                    {children}<p className="auth-alternate">{alternate} <a href={alternateHref} onClick={(e) => { e.preventDefault(); navigate(alternateHref) }}>{alternateLabel}</a>
                    </p>
                </section>
            </main>
            <Footer />
        </>
    )
}
export default AuthLayout