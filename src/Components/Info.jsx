function Info({ title, value }) {
    return (
        <div className="info-item">
            <strong>{title}</strong>
            <span>{value}</span>
        </div>
    )
}

export default Info