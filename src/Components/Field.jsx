import React from 'react'

function Field({ label, value, onChange, type = 'text', name }) {
    return (
        <label>
            {label}
            <input name={name} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} />
        </label>
    )
}

export default Field