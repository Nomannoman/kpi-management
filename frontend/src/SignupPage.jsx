import { useState } from "react";
import api from './axios';
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await api.post("/api/auth/signup/", formData);

      const response = await api.post("/api/auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      setSuccess("Account created successfully.");
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("username", formData.username);
      localStorage.setItem("first_name", formData.first_name);
      localStorage.setItem("last_name", formData.last_name);
      localStorage.setItem("role", "VIEWER");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.username) {
        setError(error.response.data.username[0]);
      } else if (error.response?.data?.password) {
        setError(error.response.data.password[0]);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(to right, #141e30, #243b55)" }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "100%", maxWidth: "450px", borderRadius: "20px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted mb-0">KPI Management System</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name (optional)</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Already have an account?</span>
          <Link to="/login" className="ms-2 text-decoration-none fw-semibold">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
