import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import '../css/login.css'

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function Login(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            navigate("/dashboard");
        } catch (err) {
            setError("Error loading Dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
    <div>
        <div className="login-page-container">
            <div className="login-page-inner-container">
                <h1 className="login">Login</h1>
                <div className="form-container">
                    <form className="form-inner-container" onSubmit={Login}>
                        <label className="email">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
                        <label className="password">Password</label><input value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
                        <Link to="/forgot-password" className="forgot-p" >Forgot password?</Link>
                        <button className="login-button" disabled={loading}>
                            {loading && <div className="loading-text">Logging in...</div>} {/* good for user experience so admin doesnt overlick when logging in */}
                            {!loading && "Log in"} 
                        </button>
                    </form>
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    </div>);
}

export default AdminLogin;

