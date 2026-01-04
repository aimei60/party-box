import { useState } from "react";
import {useNavigate} from "react-router-dom";
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
                <h1>Login</h1>
                <div >
                <form onSubmit={Login}>
                    <label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
                    <label>Password</label><input value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
                    <button disabled={loading}>
                        {loading && "Logging in..."}
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

