import { useState } from 'react'
import Field from '../Components/Field';
import navigate from '../Components/Navigate';
import AuthLayout from '../Components/AuthLayout';



function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    function submit(e) {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.');
        if (!password) return setError('Please enter your password.'); setError(''); navigate('/dashboard')
    }
    return (
        <AuthLayout title="Sign In" alternate="Do not have an account?" alternateHref="/signup" alternateLabel="Create an Account">
            <p className="auth-copy">Access your account to manage your applications, profile, jobs, or recruitment activity.</p>
            <form className="form-stack" onSubmit={submit} noValidate>
                <Field label="Email Address" type="email" value={email} onChange={setEmail} />
                <Field label="Password" type="password" value={password} onChange={setPassword} />
                <div className="form-options">
                    <label className="checkbox">
                        <input type="checkbox" /> Remember me</label>
                    <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password') }}>Forgot Password?</a>
                </div>
                {error &&
                    <p className="form-error" role="alert">{error}</p>}
                <button className="primary" type="submit">Sign In</button>
            </form>
        </AuthLayout>
    )
}

export default SignInPage