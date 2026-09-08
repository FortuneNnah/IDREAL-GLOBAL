import { useEffect, useMemo, useState } from 'react'
import { categories, categorySlugs } from './data/categories'
import { getJobs } from './data/jobs'
import './App.css'
import Header from './Components/Header'
import SearchBar from './Components/SearchBar'
import Field from './Components/Field'
import navigate from './Components/Navigate'
import AuthLayout from './Components/AuthLayout'
import SignInPage from './Pages/SignInPage'
import ContactPage from './Pages/ContactPage'
import AdminPage from './Pages/AdminPage'
import Footer from './Components/Footer'

function JobCard({ job, saved, onSave }) {
    return (
        <article className="job-card">
            <div className="job-top">
                <div className={`company-logo ${job.tone}`}>{job.logo}</div>
                <button className={saved ? 'save saved' : 'save'} onClick={() => onSave(job.id)} aria-label={`${saved ? 'Remove' : 'Save'} ${job.title}`}>{saved ? 'Saved' : 'Save'}</button>
            </div>
            <p className="job-tag">{job.category}</p>
            <h3>{job.title}</h3>
            <p className="company-name">{job.company}</p>
            <div className="job-details">
                <span>{job.location}</span>
                <span>{job.mode} · {job.type} · {job.experience}</span>
            </div>
            <div className="job-bottom">
                <strong>{job.salary}</strong>
                <span>{job.posted}</span>
            </div>
            <a className="job-link" href={`/jobs/${job.id}`} onClick={(e) => { e.preventDefault(); navigate(`/jobs/${job.id}`) }}>View job</a>
        </article>
    )
}



function HomePage() {
    const jobs = useMemo(() => getJobs().filter((job) => job.status === 'published'), [])
    const [saved, setSaved] = useState([]);
    const [keyword, setKeyword] = useState(''); const [location, setLocation] = useState('');
    const filtered = jobs.filter((job) => `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(keyword.toLowerCase()) && `${job.location} ${job.mode}`.toLowerCase().includes(location.toLowerCase()));
    return <>
        <Header />
        <main>
            <section className="hero-section">
                <div className="hero-copy">
                    <p className="eyebrow">THE NEXT STEP IN YOUR CAREER</p>
                    <h1>Work that moves<br /><em>you forward.</em></h1>
                    <p className="hero-description">Connect with meaningful opportunities at companies shaping the future. Your next chapter starts here.</p>
                </div>
                <form className="search-panel" onSubmit={(e) => { e.preventDefault(); document.querySelector('#featured-jobs')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    <div className="field">
                        <label htmlFor="home-keyword">What are you looking for?</label>
                        <input id="home-keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Job title, keyword or company" />
                    </div>
                    <div className="field">
                        <label htmlFor="home-location">Where?</label>
                        <input id="home-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, state or remote" />
                    </div>
                    <button className="primary search-button">Search Jobs</button>
                </form>
            </section>
            <section className="content-section" id="featured-jobs">
                <div className="section-heading"><div>
                    <p className="eyebrow">SELECTED FOR YOU</p>
                    <h2>Featured opportunities</h2>
                </div>
                    <a className="arrow-link" href="/jobs" onClick={(e) => { e.preventDefault(); navigate('/jobs') }}>View all jobs</a>
                </div>
                <div className="jobs-grid">{filtered.slice(0, 4).map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={(id) => setSaved(saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id])} />)}</div>{!filtered.length && <p className="empty-state">
                    No jobs match your current search. Try a different keyword or location.
                </p>}
            </section>
            <section className="category-section" id="companies">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">EXPLORE BY SPECIALISM</p>
                        <h2>Find your direction</h2>
                    </div>
                </div>
                <div className="categories">{categories.slice(0, 8).map((category) => <a className="category" key={category} href={`/jobs?category=${categorySlugs[category]}`} onClick={(e) => { e.preventDefault(); navigate(`/jobs?category=${categorySlugs[category]}`) }}>
                    <span><strong>{category}</strong><small>{Math.floor(120 + category.length * 17)} Jobs</small></span>
                    <span className="category-arrow">→</span></a>)}</div>
            </section>
            <section className="insight-section" id="resources">
                <div className="insight-number">01</div>
                <div>
                    <p className="eyebrow">CAREER INTELLIGENCE</p>
                    <h2>Make your next move<br />with confidence.</h2>
                    <p>Practical guidance for every stage of your professional journey, from expert interview advice to understanding your market value.</p>
                    <a className="arrow-link" href="/#resources" onClick={(e) => { e.preventDefault(); navigate('/#resources') }}>Explore career resources</a>
                </div>
                <div className="insight-stat"><strong>64%</strong><span>of professionals say<br />purpose matters at work</span>
                </div>
            </section>
            <section className="employer-section">
                <div>
                    <p className="eyebrow">FOR EMPLOYERS</p>
                    <h2>Build the team<br />behind your ambition.</h2>
                </div>
                <a className="outline-button" href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup') }}>Post a vacancy
                </a>
            </section>
        </main>
        <Footer />
    </>
}

function SignUpPage() {
    const [form, setForm] = useState({ first: '', last: '', email: '', password: '', confirm: '', role: 'Job Seeker', terms: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    function submit(e) {
        e.preventDefault();
        if (!form.first) return setError('Please enter your first name.');
        if (!form.last) return setError('Please enter your last name.');
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.');
        if (form.password.length < 8) return setError('Password must contain at least 8 characters.');
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        if (!form.terms) return setError('Please accept the Terms and Conditions.'); setError(''); setSuccess(true)
    }
    return (
        <AuthLayout title="Create Your Account" alternate="Already have an account?" alternateHref="/signin" alternateLabel="Sign In">
            <p className="auth-copy">Create an account to search for opportunities, manage applications, and build your professional profile.</p>
            {success ?
                <div className="success-box">
                    <strong>Account created successfully</strong>
                    <p>Continue to complete your professional profile.</p>
                    <a className="primary" href={form.role === 'Employer' ? '/employer/dashboard' : '/dashboard'} onClick={(e) => { e.preventDefault(); navigate(form.role === 'Employer' ? '/employer/dashboard' : '/dashboard') }}>Continue to onboarding</a>
                </div> :
                <form className="form-stack" onSubmit={submit} noValidate>
                    <div className="form-row">
                        <Field label="First Name" value={form.first} onChange={(value) => setForm({ ...form, first: value })} />
                        <Field label="Last Name" value={form.last} onChange={(value) => setForm({ ...form, last: value })} />
                    </div>
                    <Field label="Email Address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
                    <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
                    <Field label="Confirm Password" type="password" value={form.confirm} onChange={(value) => setForm({ ...form, confirm: value })} />
                    <label>
                        Account Type
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option>Job Seeker</option>
                            <option>Employer</option>
                        </select>
                    </label>
                    <label className="checkbox">
                        <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} /> I accept the Terms and Conditions and Privacy Policy.
                    </label>
                    {error &&
                        <p className="form-error" role="alert">{error}</p>
                    }
                    <button className="primary" type="submit">Create Account</button>
                </form>}
        </AuthLayout>
    )
}



function JobsPage() {
    const jobs = useMemo(() => getJobs().filter((job) => job.status === 'published'), [])
    const params = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState({ keyword: params.get('keyword') || '', location: params.get('location') || '', category: params.get('category') || '', type: params.get('type') || '', workplace: params.get('workplace') || '', experience: params.get('experience') || '', sort: params.get('sort') || 'Relevance' });
    const [saved, setSaved] = useState([]);
    const [mobileFilters, setMobileFilters] = useState(false);
    const matches = useMemo(() => {
        const result = jobs.filter((job) => (!filters.keyword || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(filters.keyword.toLowerCase())) && (!filters.location || `${job.location} ${job.mode}`.toLowerCase().includes(filters.location.toLowerCase())) && (!filters.category || categorySlugs[job.category] === filters.category || job.category === filters.category) && (!filters.type || job.type === filters.type) && (!filters.workplace || job.mode === filters.workplace) && (!filters.experience || job.experience === filters.experience)); return result.sort((a, b) => filters.sort === 'Salary: High to Low' ? b.salary.localeCompare(a.salary) : filters.sort === 'Salary: Low to High' ? a.salary.localeCompare(b.salary) : filters.sort === 'Most Recent' ? a.id - b.id : a.id - b.id)
    }, [filters, jobs]); function update(next) {
        const changed = { ...filters, ...next }; setFilters(changed);
        const query = new URLSearchParams(Object.entries(changed).filter(([, value]) => value && value !== 'Relevance')); window.history.replaceState({}, '', `/jobs?${query}`)
    }
    function clear() {
        update({ keyword: '', location: '', category: '', type: '', workplace: '', experience: '' })
    }
    return <>
        <Header />
        <main className="jobs-page">
            <div className="page-intro">
                <p className="eyebrow">OPPORTUNITY MARKETPLACE</p>
                <h1>Find Your Next Opportunity</h1>
                <p>Browse available job opportunities and find a position that matches your skills, experience, and career goals.</p>
            </div>
            <SearchBar initialKeyword={filters.keyword} initialLocation={filters.location} onSearch={(keyword, location) => update({ keyword, location })} />
            <div className="jobs-toolbar">
                <strong>{matches.length * 156 + 12} Jobs Found</strong>
                <button className="filter-toggle" onClick={() => setMobileFilters(!mobileFilters)}>Filters
                </button>
                <label>Sort by <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}><
                    option>Relevance</option>
                    <option>Most Recent</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                </select>
                </label>
            </div>
            <div className="jobs-layout">
                <aside className={mobileFilters ? 'filters mobile-open' : 'filters'}>
                    <div className="filter-title">
                        <strong>Filter results</strong>
                        <button onClick={clear}>Clear filters</button>
                    </div>
                    <Filter label="Job Category" value={filters.category} options={categories} onChange={(value) => update({ category: value })} />
                    <Filter label="Employment Type" value={filters.type} options={['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance']} onChange={(value) => update({ type: value })} />
                    <Filter label="Workplace Type" value={filters.workplace} options={['On-site', 'Hybrid', 'Remote']} onChange={(value) => update({ workplace: value })} />
                    <Filter label="Experience Level" value={filters.experience} options={['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Executive']} onChange={(value) => update({ experience: value })} />
                    <label>Minimum salary<input type="number" placeholder="$ 0" />
                    </label>
                    <label>Maximum salary<input type="number" placeholder="$ 200,000" />
                    </label>
                </aside>
                <section className="results">
                    <div className="jobs-list">{matches.map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={(id) => setSaved(saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id])} />)}
                    </div>
                    {!matches.length &&
                        <div className="empty-state">
                            <h3>No Jobs Found</h3>
                            <p>We could not find job opportunities matching your current search and filters.</p>
                            <button className="primary" onClick={clear}>Clear Filters</button>
                        </div>}
                    <div className="pagination">
                        <button disabled>Previous</button>
                        <strong>1</strong>
                        <button>2</button>
                        <button>3</button>
                        <button>Next</button>
                    </div>
                </section>
            </div>
        </main>
        <Footer />
    </>
}
function Filter({ label, value, options, onChange }) {
    return (
        <label>
            {label}
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">All {label.toLowerCase()}</option>
                {options.map((option) =>
                    <option key={option} value={label === 'Job Category' ? categorySlugs[option] : option}>
                        {option}
                    </option>)}
            </select>
        </label>
    )
}

function JobDetailPage({ jobId }) {
    const jobs = getJobs().filter((job) => job.status === 'published')
    const job = jobs.find((entry) => String(entry.id) === String(jobId))
    if (!job) return <NotFoundPage />

    return (
        <>
            <Header />
            <main className="job-detail-page">
                <div className="page-intro">
                    <p className="eyebrow">JOB OPPORTUNITY</p>
                    <h1>{job.title}</h1>
                    <p>{job.company} · {job.location}</p>
                </div>
                <section className="job-detail-card">
                    <div className="job-top">
                        <div className={`company-logo ${job.tone}`}>{job.logo}</div>
                        <div>
                            <h2>{job.title}</h2>
                            <p>{job.company}</p>
                        </div>
                    </div>
                    <div className="job-details">
                        <span>{job.location}</span>
                        <span>{job.mode} · {job.type} · {job.experience}</span>
                    </div>
                    <div className="job-bottom">
                        <strong>{job.salary}</strong>
                        <span>{job.posted}</span>
                    </div>
                    <p>This role sits within {job.category} and is designed for candidates who want to build meaningful work in a collaborative environment.</p>
                    <div className="job-actions">
                        <button className="primary" type="button">Apply Now</button>
                        <button className="outline-button" type="button" onClick={() => navigate('/jobs')}>Back to Jobs</button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}


function ForgotPasswordPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <section className="auth-card">
                    <p className="eyebrow">ACCOUNT RECOVERY</p>
                    <h1>Reset Your Password</h1>
                    <p className="auth-copy">Enter your email address and we will send a secure reset link to help you regain access.</p>
                    <form className="form-stack">
                        <Field label="Email Address" type="email" />
                        <button className="primary" type="button" onClick={() => navigate('/signin')}>Send Reset Link</button>
                    </form>
                </section>
            </main>
            <Footer />
        </>
    )
}

function DashboardPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <section className="auth-card">
                    <p className="eyebrow">JOB SEEKER DASHBOARD</p>
                    <h1>Welcome back</h1>
                    <p className="auth-copy">Your saved jobs, applications, and recommended roles are ready to review.</p>
                    <button className="primary" type="button" onClick={() => navigate('/jobs')}>View Jobs</button>
                </section>
            </main>
            <Footer />
        </>
    )
}

function EmployerDashboardPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <section className="auth-card">
                    <p className="eyebrow">EMPLOYER DASHBOARD</p>
                    <h1>Recruiting overview</h1>
                    <p className="auth-copy">Track hiring activity, shortlisted candidates, and active listings from one place.</p>
                    <button className="primary" type="button" onClick={() => navigate('/jobs')}>Manage Listings</button>
                </section>
            </main>
            <Footer />
        </>
    )
}

function NotFoundPage() {
    return (
        <>
            <Header />
            <main className="auth-page">
                <section className="auth-card">
                    <p className="eyebrow">404</p>
                    <h1>Page not found</h1>
                    <p className="auth-copy">The page you requested does not exist or has moved. Head back home to continue exploring.</p>
                    <button className="primary" type="button" onClick={() => navigate('/')}>Return Home</button>
                </section>
            </main>
            <Footer />
        </>
    )
}

function App() {
    const [route, setRoute] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`)

    useEffect(() => {
        const listener = () => setRoute(`${window.location.pathname}${window.location.search}${window.location.hash}`)
        window.addEventListener('popstate', listener)
        return () => window.removeEventListener('popstate', listener)
    }, [])

    if (route === '/' || route === '/#companies' || route === '/#resources') return <HomePage />
    if (route === '/jobs' || route.startsWith('/jobs?')) return <JobsPage />
    if (route.startsWith('/jobs/')) {
        const match = route.match(/^\/jobs\/(\d+)/)
        return <JobDetailPage jobId={match ? match[1] : null} />
    }
    if (route === '/signup') return <SignUpPage />
    if (route === '/signin') return <SignInPage />
    if (route === '/contact') return <ContactPage />
    if (route === '/forgot-password') return <ForgotPasswordPage />
    if (route === '/dashboard') return <DashboardPage />
    if (route === '/employer/dashboard') return <EmployerDashboardPage />
    if (route === '/admin' || route.startsWith('/admin/')) return <AdminPage route={route} />

    return <NotFoundPage />
}

export default App
