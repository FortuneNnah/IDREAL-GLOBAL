import React from 'react'
import { useState } from 'react'

function SearchBar({ initialKeyword = '', initialLocation = '', onSearch }) {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [location, setLocation] = useState(initialLocation);
    return (
        <form className="search-panel compact" onSubmit={(e) => { e.preventDefault(); onSearch(keyword, location) }}>
            <div className="field">
                <label htmlFor="search-keyword">Search by keyword</label>
                <input id="search-keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Job title, keyword, skill, or company" />
            </div>
            <div className="field">
                <label htmlFor="search-location">Location</label>
                <input id="search-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, state, country, or remote" />
            </div>
            <button className="primary search-button" type="submit">Search Jobs</button>
        </form>
    )
}

export default SearchBar