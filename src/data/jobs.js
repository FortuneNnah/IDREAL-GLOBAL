const seedJobs = [
  ['Senior Product Designer', 'Northstar Labs', 'New York, NY', 'Full-time', 'Hybrid', '$135k - $165k', '2 days ago', 'Product Management', 'NL', 'navy'],
  ['Frontend Engineer', 'Aster Technologies', 'San Francisco, CA', 'Full-time', 'Remote', '$150k - $190k', '4 days ago', 'Software Development', 'AT', 'blue'],
  ['Marketing Operations Manager', 'Meridian Group', 'Chicago, IL', 'Full-time', 'On-site', '$92k - $118k', '7 days ago', 'Marketing & Communications', 'MG', 'green'],
  ['Data Analyst', 'Civic Financial', 'Boston, MA', 'Full-time', 'Hybrid', '$88k - $110k', '9 days ago', 'Data & Analytics', 'CF', 'gold'],
  ['Senior Software Engineer', 'Pillar Systems', 'Austin, TX', 'Full-time', 'Remote', '$145k - $180k', '11 days ago', 'Software Development', 'PS', 'navy'],
  ['People Operations Specialist', 'Common Ground', 'Denver, CO', 'Full-time', 'Hybrid', '$78k - $96k', '14 days ago', 'Human Resources', 'CG', 'blue'],
  ['Financial Analyst', 'Harbor Capital', 'New York, NY', 'Full-time', 'On-site', '$85k - $105k', '18 days ago', 'Accounting & Finance', 'HC', 'green'],
  ['Customer Success Manager', 'Arcwell Health', 'Remote', 'Full-time', 'Remote', '$90k - $115k', '21 days ago', 'Customer Service', 'AH', 'gold'],
].map(([title, company, location, type, mode, salary, posted, category, logo, tone], index) => ({
  id: index + 1,
  title,
  company,
  location,
  type,
  mode,
  salary,
  posted,
  category,
  logo,
  tone,
  experience: index % 2 ? 'Mid Level' : 'Senior',
  status: 'published',
  applications: 0,
  createdAt: new Date(Date.now() - (index + 2) * 86400000).toISOString(),
}))

const storageKey = 'idreal_jobs'

export function getJobs() {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : seedJobs
  } catch {
    return seedJobs
  }
}

export function saveJobs(jobs) {
  window.localStorage.setItem(storageKey, JSON.stringify(jobs))
  window.dispatchEvent(new CustomEvent('idreal-jobs-updated'))
}

export function getNextJobId(jobs) {
  return jobs.reduce((highest, job) => Math.max(highest, Number(job.id) || 0), 0) + 1
}

export function makeJob(values, jobs) {
  const id = getNextJobId(jobs)
  const now = new Date().toISOString()
  return {
    id,
    title: values.title,
    company: values.company,
    department: values.department,
    category: values.category,
    industry: values.industry,
    reference: values.reference,
    location: [values.city, values.state, values.country].filter(Boolean).join(', '),
    city: values.city,
    state: values.state,
    country: values.country,
    type: values.type,
    mode: values.mode,
    experience: values.experience,
    salary: values.salaryMin && values.salaryMax ? `${values.currency} ${values.salaryMin} - ${values.salaryMax}` : 'Salary undisclosed',
    salaryMin: values.salaryMin,
    salaryMax: values.salaryMax,
    currency: values.currency,
    frequency: values.frequency,
    summary: values.summary,
    description: values.description,
    responsibilities: values.responsibilities,
    requirements: values.requirements,
    qualifications: values.qualifications,
    benefits: values.benefits,
    skills: values.skills,
    applicationMethod: values.applicationMethod,
    applicationUrl: values.applicationUrl,
    applicationEmail: values.applicationEmail,
    deadline: values.deadline,
    status: values.status,
    featured: values.featured,
    publishedAt: values.status === 'published' ? now : '',
    expiresAt: values.expiresAt,
    createdAt: now,
    updatedAt: now,
    posted: values.status === 'published' ? 'Just now' : 'Draft',
    logo: values.company.slice(0, 2).toUpperCase() || 'CO',
    tone: 'blue',
    applications: 0,
  }
}

export const emptyJobForm = {
  title: '', company: '', department: '', category: '', industry: '', reference: '',
  country: '', state: '', city: '', mode: 'Remote', type: 'Full-time', experience: 'Mid Level',
  salaryMin: '', salaryMax: '', currency: 'USD', frequency: 'Yearly', summary: '', description: '',
  responsibilities: '', requirements: '', qualifications: '', benefits: '', skills: '',
  applicationMethod: 'Email', applicationUrl: '', applicationEmail: '', deadline: '',
  status: 'draft', featured: false, expiresAt: '',
}

export function jobToForm(job) {
  return {
    ...emptyJobForm,
    ...job,
    city: job.city || job.location?.split(', ')[0] || '',
    state: job.state || job.location?.split(', ')[1] || '',
    country: job.country || job.location?.split(', ')[2] || '',
    salaryMin: job.salaryMin || '',
    salaryMax: job.salaryMax || '',
    skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
  }
}
