import { useEffect, useMemo, useState } from 'react'
import { categories } from '../data/categories'
import { emptyJobForm, getJobs, jobToForm, makeJob, saveJobs } from '../data/jobs'
import navigate from '../Components/Navigate'

const adminNav = [
  ['Dashboard', '/admin'],
  ['Jobs', '/admin/jobs'],
  ['Applications', '/admin/applications'],
  ['Users', '/admin/users'],
  ['Employers', '/admin/employers'],
  ['Categories', '/admin/categories'],
  ['Career Resources', '/admin/resources'],
  ['Reports', '/admin/reports'],
  ['Settings', '/admin/settings'],
]

function AdminLayout({ children, active, title, description, action }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="admin-shell">
      <aside className={open ? 'admin-sidebar open' : 'admin-sidebar'}>
        <div className="admin-brand"><span className="brand-mark">ID</span><span>Admin Console</span></div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {adminNav.map(([label, href]) => <a className={active === href ? 'active' : ''} href={href} key={href} onClick={(e) => { e.preventDefault(); setOpen(false); navigate(href) }}>{label}</a>)}
        </nav>
        <div className="admin-account">
          <strong>Administrator</strong>
          <button onClick={() => { localStorage.removeItem('idreal_role'); navigate('/signin') }}>Sign Out</button>
        </div>
      </aside>
      <button className="admin-menu-button" onClick={() => setOpen(!open)} aria-label="Open admin navigation">Menu</button>
      <main className="admin-main">
        <header className="admin-page-header">
          <div><p className="eyebrow">ADMINISTRATION</p><h1>{title}</h1><p>{description}</p></div>
          {action}
        </header>
        {children}
      </main>
    </div>
  )
}

function Toast({ message }) {
  return message ? <div className="admin-toast" role="status">{message}</div> : null
}

function AdminOverview({ jobs }) {
  const published = jobs.filter((job) => job.status === 'published')
  const drafts = jobs.filter((job) => job.status === 'draft')
  const recent = [...jobs].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5)
  const metrics = [['Total Jobs', jobs.length], ['Active Jobs', published.length], ['Draft Jobs', drafts.length], ['Total Applications', jobs.reduce((sum, job) => sum + (job.applications || 0), 0)], ['Job Seekers', 0], ['Employers', new Set(jobs.map((job) => job.company)).size], ['Posted This Month', published.filter((job) => new Date(job.createdAt).getMonth() === new Date().getMonth()).length], ['New Applications Today', 0]]

  return (
    <AdminLayout active="/admin" title="Admin Dashboard" description="Manage jobs, users, employers, applications, and platform activity from one place." action={<button className="primary" onClick={() => navigate('/admin/jobs/new')}>Post a Job</button>}>
      <section className="admin-metrics">{metrics.map(([label, value]) => <div className="admin-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
      <section className="admin-grid two-column">
        <div className="admin-panel"><div className="panel-heading"><h2>Recent Jobs</h2><a href="/admin/jobs" onClick={(e) => { e.preventDefault(); navigate('/admin/jobs') }}>View all</a></div><AdminJobTable jobs={recent} compact /></div>
        <div className="admin-panel"><div className="panel-heading"><h2>Quick Actions</h2></div><div className="quick-actions"><button onClick={() => navigate('/admin/jobs/new')}>Post a Job <span>+</span></button><button onClick={() => navigate('/admin/jobs')}>Manage Jobs <span>→</span></button><button onClick={() => navigate('/admin/users')}>Manage Users <span>→</span></button><button onClick={() => navigate('/admin/employers')}>Manage Employers <span>→</span></button></div></div>
      </section>
      <section className="admin-panel"><div className="panel-heading"><h2>Recent Applications</h2><span className="muted">No applications recorded yet</span></div><div className="admin-empty">Applications will appear here when candidates apply to published jobs.</div></section>
    </AdminLayout>
  )
}

function AdminJobTable({ jobs, compact = false, onChange }) {
  if (!jobs.length) return <div className="admin-empty">No jobs have been created yet.</div>
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Job Title</th><th>Company</th><th>Category</th><th>Status</th><th>Applications</th><th>Actions</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id}><td><strong>{job.title}</strong><small>{job.location || 'Location not set'}</small></td><td>{job.company}</td><td>{job.category || 'Uncategorized'}</td><td><span className={`status status-${job.status}`}>{job.status}</span></td><td>{job.applications || 0}</td><td><div className="table-actions"><button onClick={() => navigate(`/jobs/${job.id}`)}>View</button><button onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}>Edit</button>{!compact && <>{job.status === 'draft' && <button onClick={() => onChange(job, 'published')}>Publish</button>}{job.status === 'published' && <button onClick={() => onChange(job, 'paused')}>Pause</button>}{job.status === 'paused' && <button onClick={() => onChange(job, 'published')}>Resume</button>}<button className="danger-text" onClick={() => onChange(job, 'delete')}>Delete</button></>}</div></td></tr>)}</tbody></table></div>
}

function AdminJobs({ jobs, setJobs }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const filtered = useMemo(() => jobs.filter((job) => (!status || job.status === status) && (!query || `${job.title} ${job.company} ${job.reference || ''}`.toLowerCase().includes(query.toLowerCase()))), [jobs, query, status])
  function changeJob(job, action) {
    if (action === 'delete' && !window.confirm(`Delete ${job.title}? This action cannot be undone.`)) return
    const next = action === 'delete' ? jobs.filter((entry) => entry.id !== job.id) : jobs.map((entry) => entry.id === job.id ? { ...entry, status: action, updatedAt: new Date().toISOString() } : entry)
    setJobs(next); saveJobs(next); setMessage(action === 'delete' ? 'Job deleted' : `Job ${action === 'published' ? 'published' : action}`); window.setTimeout(() => setMessage(''), 2500)
  }
  return <AdminLayout active="/admin/jobs" title="Job Management" description="Search, review, and control every job listing on the platform." action={<button className="primary" onClick={() => navigate('/admin/jobs/new')}>Post a Job</button>}>
    <div className="admin-toolbar"><input aria-label="Search jobs" placeholder="Search title, company, or reference" value={query} onChange={(e) => setQuery(e.target.value)} /><select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="paused">Paused</option><option value="closed">Closed</option></select><button className="secondary-button" onClick={() => { setQuery(''); setStatus('') }}>Clear filters</button></div>
    <section className="admin-panel"><AdminJobTable jobs={filtered} onChange={changeJob} /></section><Toast message={message} />
  </AdminLayout>
}

function TextAreaField({ label, name, value, onChange, required }) {
  return <label className="admin-field wide">{label}{required && <span className="required"> *</span>}<textarea name={name} value={value} onChange={onChange} rows={4} placeholder={`Enter ${label.toLowerCase()}`} /></label>
}

function InputField({ label, name, value, onChange, required, type = 'text', options }) {
  return <label className="admin-field">{label}{required && <span className="required"> *</span>}{options ? <select name={name} value={value} onChange={onChange}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={name} type={type} value={value} onChange={onChange} placeholder={`Enter ${label.toLowerCase()}`} />}</label>
}

function JobForm({ initial, editing, onComplete }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)
  function change(e) { const { name, value, type, checked } = e.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })); setMessage('Unsaved changes') }
  function validate(publish) {
    const required = ['title', 'company', 'category', 'city', 'mode', 'type', 'experience', 'description', 'responsibilities', 'requirements', 'applicationMethod', 'deadline']
    const missing = publish ? required.filter((field) => !String(form[field] || '').trim()) : []
    setErrors(missing)
    return !missing.length
  }
  function submit(status) {
    if (!validate(status === 'published')) return
    if (status === 'published' && !window.confirm('Publish Job? This job will become visible on the public jobs page immediately after publishing.')) return
    const all = getJobs()
    const nextJob = editing ? { ...makeJob(form, all), id: initial.id, createdAt: initial.createdAt, updatedAt: new Date().toISOString() } : makeJob(form, all)
    const next = editing ? all.map((job) => job.id === initial.id ? nextJob : job) : [...all, nextJob]
    saveJobs(next)
    setMessage(status === 'published' ? 'Job Published Successfully' : 'Job Saved as Draft')
    window.setTimeout(() => onComplete(nextJob, status), 500)
  }
  if (preview) return <AdminLayout active="/admin/jobs" title="Preview Job" description="Review the public-facing job listing before publishing." action={<button className="secondary-button" onClick={() => setPreview(false)}>Return to editing</button>}><article className="job-preview"><p className="eyebrow">PREVIEW MODE</p><h2>{form.title || 'Untitled role'}</h2><p className="preview-company">{form.company || 'Company name'} · {[form.city, form.state, form.country].filter(Boolean).join(', ') || 'Location not set'}</p><div className="preview-meta"><span>{form.mode}</span><span>{form.type}</span><span>{form.experience}</span></div><h3>About the role</h3><p>{form.description || 'No description entered yet.'}</p><h3>Responsibilities</h3><p>{form.responsibilities || 'No responsibilities entered yet.'}</p><h3>Requirements</h3><p>{form.requirements || 'No requirements entered yet.'}</p></article></AdminLayout>
  return <AdminLayout active="/admin/jobs" title={editing ? 'Edit Job' : 'Post a New Job'} description="Create and publish a job opportunity directly to the platform." action={<div className="form-actions top-actions"><button className="secondary-button" onClick={() => setPreview(true)}>Preview Job</button><button className="secondary-button" onClick={() => submit('draft')}>Save Draft</button><button className="primary" onClick={() => submit('published')}>Publish Job</button></div>}>
    <form className="admin-form" onSubmit={(e) => e.preventDefault()} noValidate>
      {errors.length > 0 && <div className="admin-error" role="alert">Please complete the required fields: {errors.map((field) => field.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}.</div>}
      <fieldset><legend>Basic Information</legend><div className="admin-form-grid"><InputField label="Job Title" name="title" value={form.title} onChange={change} required /><InputField label="Company" name="company" value={form.company} onChange={change} required /><InputField label="Department" name="department" value={form.department} onChange={change} /><InputField label="Job Category" name="category" value={form.category} onChange={change} required options={categories} /><InputField label="Industry" name="industry" value={form.industry} onChange={change} /><InputField label="Job Reference Number" name="reference" value={form.reference} onChange={change} /></div></fieldset>
      <fieldset><legend>Location & Workplace</legend><div className="admin-form-grid"><InputField label="Country" name="country" value={form.country} onChange={change} required /><InputField label="State / Region" name="state" value={form.state} onChange={change} /><InputField label="City" name="city" value={form.city} onChange={change} required /><InputField label="Workplace Type" name="mode" value={form.mode} onChange={change} required options={['On-site', 'Hybrid', 'Remote']} /></div></fieldset>
      <fieldset><legend>Employment Details</legend><div className="admin-form-grid"><InputField label="Employment Type" name="type" value={form.type} onChange={change} required options={['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance']} /><InputField label="Experience Level" name="experience" value={form.experience} onChange={change} required options={['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Executive']} /><InputField label="Salary Min" name="salaryMin" value={form.salaryMin} onChange={change} type="number" /><InputField label="Salary Max" name="salaryMax" value={form.salaryMax} onChange={change} type="number" /><InputField label="Salary Currency" name="currency" value={form.currency} onChange={change} options={['USD', 'EUR', 'GBP', 'NGN']} /><InputField label="Salary Frequency" name="frequency" value={form.frequency} onChange={change} options={['Yearly', 'Monthly', 'Hourly']} /></div></fieldset>
      <fieldset><legend>Job Description</legend><div className="admin-form-grid"><TextAreaField label="Summary" name="summary" value={form.summary} onChange={change} /><TextAreaField label="Job Description" name="description" value={form.description} onChange={change} required /><TextAreaField label="Responsibilities" name="responsibilities" value={form.responsibilities} onChange={change} required /><TextAreaField label="Requirements" name="requirements" value={form.requirements} onChange={change} required /><TextAreaField label="Qualifications" name="qualifications" value={form.qualifications} onChange={change} /><TextAreaField label="Benefits" name="benefits" value={form.benefits} onChange={change} /><InputField label="Required Skills" name="skills" value={form.skills} onChange={change} /></div></fieldset>
      <fieldset><legend>Application Details</legend><div className="admin-form-grid"><InputField label="Application Method" name="applicationMethod" value={form.applicationMethod} onChange={change} required options={['Email', 'External URL', 'Platform application']} /><InputField label="Application URL" name="applicationUrl" value={form.applicationUrl} onChange={change} type="url" /><InputField label="Application Email" name="applicationEmail" value={form.applicationEmail} onChange={change} type="email" /><InputField label="Application Deadline" name="deadline" value={form.deadline} onChange={change} required type="date" /></div></fieldset>
      <fieldset><legend>Visibility</legend><div className="admin-form-grid"><InputField label="Status" name="status" value={form.status} onChange={change} options={['draft', 'published', 'paused', 'closed']} /><InputField label="Expiration Date" name="expiresAt" value={form.expiresAt} onChange={change} type="date" /><label className="admin-check"><input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Featured job</label></div></fieldset>
      <div className="form-actions sticky-actions"><button className="secondary-button" type="button" onClick={() => submit('draft')}>Save Draft</button><button className="secondary-button" type="button" onClick={() => setPreview(true)}>Preview Job</button><button className="primary" type="button" onClick={() => submit('published')}>Publish Job</button></div><Toast message={message} />
    </form>
  </AdminLayout>
}

function AdminPlaceholder({ section }) {
  return <AdminLayout active={`/admin/${section}`} title={section[0].toUpperCase() + section.slice(1)} description={`Manage ${section} across the platform from the administration console.`}><section className="admin-panel"><div className="admin-empty"><h2>{section === 'applications' ? 'No applications recorded yet' : 'Workspace ready'}</h2><p>This section is connected to the admin navigation and ready for platform data integration.</p></div></section></AdminLayout>
}

function AdminPage({ route }) {
  const [jobs, setJobs] = useState(() => getJobs())
  useEffect(() => { const update = () => setJobs(getJobs()); window.addEventListener('idreal-jobs-updated', update); return () => window.removeEventListener('idreal-jobs-updated', update) }, [])
  const role = localStorage.getItem('idreal_role')
  if (role !== 'administrator') return <AdminLayout active="/admin" title="Access restricted" description="Administrator permissions are required to access this area."><section className="admin-panel"><div className="admin-empty"><h2>Administrator access required</h2><p>Your account does not have permission to manage this platform.</p><button className="primary" onClick={() => navigate('/')}>Return Home</button></div></section></AdminLayout>
  if (route === '/admin' || route === '/admin/') return <AdminOverview jobs={jobs} />
  if (route === '/admin/jobs') return <AdminJobs jobs={jobs} setJobs={setJobs} />
  if (route === '/admin/jobs/new') return <JobForm initial={emptyJobForm} onComplete={() => navigate('/admin/jobs')} />
  const editMatch = route.match(/^\/admin\/jobs\/(\d+)\/edit$/)
  if (editMatch) { const job = jobs.find((entry) => String(entry.id) === editMatch[1]); return job ? <JobForm initial={jobToForm(job)} editing onComplete={() => navigate('/admin/jobs')} /> : <AdminPlaceholder section="jobs" /> }
  const section = route.match(/^\/admin\/([^/]+)/)?.[1] || 'dashboard'
  return <AdminPlaceholder section={section} />
}

export default AdminPage
