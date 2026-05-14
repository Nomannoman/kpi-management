import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";

function UserManagement() {
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(1);

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/?page=${pageNumber}`);
      setUsers(res.data.results);
      setCount(res.data.count);
      setPageSize((prev) => Math.max(prev, res.data.results.length));
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleSave = async (user) => {
    try {
      setSavingId(user.id);
      await api.put(`/api/users/${user.id}/`, {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      });
      showToast("User updated successfully", "success");
    } catch (err) {
      console.error(err);
      setError("Failed to update user");
      showToast("Update failed", "danger");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div style={{ width: "60%" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">User Management</h2>
            <p className="text-muted mb-0">Edit user details and roles</p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/me")}
          >
            Back
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <h5 className="mb-2">No Users Found</h5>
              <p className="text-muted mb-0">There are no other users in the system.</p>
            </div>
          </div>
        ) : (
          <>
            {users.map((user) => (
              <div key={user.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small text-muted">First Name</label>
                      <input
                        className="form-control"
                        value={user.first_name || ""}
                        onChange={(e) => handleChange(user.id, "first_name", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Last Name</label>
                      <input
                        className="form-control"
                        value={user.last_name || ""}
                        onChange={(e) => handleChange(user.id, "last_name", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Role</label>
                      <select
                        className="form-select"
                        value={user.role}
                        onChange={(e) => handleChange(user.id, "role", e.target.value)}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-primary btn-sm px-4"
                      onClick={() => handleSave(user)}
                      disabled={savingId === user.id}
                    >
                      {savingId === user.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page === 1}
                onClick={() => fetchUsers(page - 1)}
              >
                Prev
              </button>
              <span className="small text-muted">
                Page {page} of {Math.ceil(count / pageSize)}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page >= Math.ceil(count / pageSize)}
                onClick={() => fetchUsers(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {Toast}
    </div>
  );
}

export default UserManagement;
