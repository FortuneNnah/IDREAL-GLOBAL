function navigate(path) {
    const fullPath = path.startsWith('http') ? path : path.startsWith('/') ? path : `/${path}`
    const target = fullPath.startsWith('http') ? new URL(fullPath) : null
    const resolved = target ? `${target.pathname}${target.search}${target.hash}` : fullPath
    window.history.pushState({}, '', resolved)
    window.dispatchEvent(new PopStateEvent('popstate'))
}

export default navigate