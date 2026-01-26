import { useState } from "react";
import { Link } from "react-router-dom";
import '../css/forgotpassword.css'

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
        const res = await fetch("/api/admin/auth/forgot-password", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("If that email exists, a reset link has been sent.");
        } else {
            setError(data.error || "Something went wrong");
        }
    } catch (err) {
        setError("Server error");
    }
  }

  return (
    <div className="forgot-page-container">
        <div className="forgot-page-inner-container">
        <h2 className="forgot-password-title">Forgot password</h2>
        <form onSubmit={handleSubmit} className="forgot-form-inner-container">
            <input type="email" placeholder="johnsmith@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <button type="submit" className="reset-link-button">Send reset link</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <Link to="/login" className="return-login">Back to login</Link>
        </div>
    </div>
    );
}

export default AdminForgotPassword;
