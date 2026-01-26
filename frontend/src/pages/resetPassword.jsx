import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/resetpassword.css'

function AdminResetPassword() {
  const location = useLocation();//gets the current url to read values from it
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search);//extracts after ? in url
  const token = search.get("token");//extracts token value from url

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful");
        setTimeout(function () {navigate("/login");}, 1000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch (err) {
      setError("Server error");
    }
  }

  return (
    <div className="reset-page-container">
        <div className="reset-page-inner-container">
        <h2 className="reset-password-title">Reset admin password</h2>
        <form onSubmit={handleSubmit} className="reset-form-inner-container">
            <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button type="submit" className="reset-password-button">Reset password</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <Link to="/login" className="return-login">Back to login</Link>
        </div>
    </div>)
}

export default AdminResetPassword;
