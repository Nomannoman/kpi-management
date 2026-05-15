import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "",
  });
  const [requestedRole, setRequestedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const res = await api.get("/api/users/me/");
        setUser(res.data);
        setRequestedRole(res.data.role);

        const req = await api.get("/api/users/role-request/active/");
        setActiveRequest(req.data.exists ? req.data : null);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleRequest = async () => {
    if (requestedRole === user.role) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.post("/api/users/role-request/", { requestedRole });
      setSuccess("Role change request submitted for approval.");

      const req = await api.get("/api/users/role-request/active/");
      setActiveRequest(req.data.exists ? req.data : null);
    } catch (err) {
      console.error(err);
      setError("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    navigate("/login");
  };

  const isButtonDisabled = loading || requestedRole === user.role;
  const hasActiveRequest = activeRequest?.exists;

  if (loadingPage) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div
          className="w-100 mb-3 d-flex justify-content-between align-items-center"
          style={{ maxWidth: "500px" }}
        >
          <button
            className="btn btn-link text-decoration-none text-secondary fw-semibold p-0"
            onClick={() => navigate("/")}
          >
            {"← Home"}
          </button>


        </div>

        <div className="card shadow-sm border-0 p-4 w-100" style={{ maxWidth: "500px" }}>
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h2 className="h4 fw-bold text-dark mb-0">
                User Profile
              </h2>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/myprojects")}
                >
                  My Projects
                </button>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/mykpis")}
                >
                  My KPIs
                </button>
              </div>
            </div>

            {(user.role === "ADMIN" && <p className="small text-muted mb-4">View account details and manage system permissions.</p>)}
            <hr className="text-muted opacity-25 mb-4" />

            <div className="vstack gap-3 mb-4">
              <div className="d-flex justify-content-between border-bottom pb-3">
                <span className="small fw-semibold text-secondary">Username</span>
                <span className="small fw-medium">{user.username || "—"}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-3">
                <span className="small fw-semibold text-secondary">Name</span>
                <span className="small fw-medium">
                  {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}
                </span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-3">
                <span className="small fw-semibold text-secondary">Current Role</span>
                <span className="badge bg-secondary">{user.role || "VIEWER"}</span>
              </div>
            </div>

            {user.role !== "ADMIN" && (
              hasActiveRequest ? (
                <div className="alert alert-info">
                  <div className="fw-semibold">Pending Role Request</div>
                  <div>
                    Requested Role:{" "}
                    <span className="fw-bold">{activeRequest.requested_role}</span>
                  </div>
                  <div className="small text-muted">Status: {activeRequest.status}</div>
                </div>
              ) : (
                <div className="bg-light rounded p-3 border mb-4">
                  <h3 className="h6 fw-bold mb-2">Request Access Level</h3>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value)}
                  >
                    <option value="VIEWER">VIEWER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={handleRoleRequest}
                    disabled={isButtonDisabled}
                    className="btn btn-sm btn-primary w-100"
                  >
                    {loading ? "Sending..." : "Request Role Change"}
                  </button>
                </div>
              )
            )}

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            {user.role === "ADMIN" && (
              <div className="row g-2 mt-3">
                <div className="col-6">
                  <button
                    onClick={() => navigate("/rolerequests")}
                    className="btn btn-outline-dark w-100"
                  >
                    Role Change Requests
                  </button>
                </div>
                <div className="col-6">
                  <button
                    onClick={() => navigate("/rolerequesthistory")}
                    className="btn btn-outline-dark w-100"
                  >
                    Role Change Req. History
                  </button>
                </div>
                <button
                  onClick={() => navigate('/usermanagement')}
                  className="btn btn-outline-primary w-100 mt-3"
                >
                  View and edit all users
                </button>
              </div>


            )}



            <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-3">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
