import { useState } from "react";
import api from "./axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login/", formData);
      localStorage.setItem("access", response.data.access);

      const meResponse = await api.get("/api/users/me/", {
        headers: { Authorization: `Bearer ${response.data.access}` },
      });

      localStorage.setItem("role", meResponse.data.role);
      localStorage.setItem("username", meResponse.data.username);
      localStorage.setItem("first_name", meResponse.data.first_name);
      localStorage.setItem("last_name", meResponse.data.last_name);
      localStorage.setItem("user_id", meResponse.data.id);

      navigate("/");
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid username or password"
      );
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
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted mb-0">KPI Management System</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

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
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Don&apos;t have an account?</span>
          <Link to="/signup" className="ms-2 text-decoration-none fw-semibold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
