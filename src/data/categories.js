export const categories = [
  'Accounting & Finance', 'Administration', 'Architecture', 'Banking', 'Business Development',
  'Construction', 'Customer Service', 'Data & Analytics', 'Education', 'Engineering',
  'Healthcare', 'Human Resources', 'Information Technology', 'Insurance', 'Legal',
  'Logistics & Supply Chain', 'Marketing & Communications', 'Media & Creative', 'Operations',
  'Product Management', 'Project Management', 'Real Estate', 'Research', 'Retail', 'Sales',
  'Security', 'Software Development', 'Telecommunications', 'Tourism & Hospitality',
  'Transportation', 'Manufacturing', 'Public Sector', 'Nonprofit & Development', 'Consulting',
  'Science & Technology',
]

export const categorySlugs = Object.fromEntries(
  categories.map((category) => [category, category.toLowerCase().replaceAll('&', 'and').replaceAll(/[^a-z0-9]+/g, '-')])
)
