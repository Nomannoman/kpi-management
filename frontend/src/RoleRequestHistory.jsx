import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";

function RoleRequestHistory() {
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
  
    const date = new Date(isoString);
  
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/users/role-requests/history/");
      setRequests(res.data);

    } catch (err) {
      console.error(err);
      showToast("Failed to load role request history.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">

      <div className="w-100" style={{ maxWidth: "60%" }}>

        <div className="d-flex justify-content-between align-items-start mb-4">

          <div>
            <h2 className="fw-bold mb-1">
              Role Request History
            </h2>

            <p className="text-muted mb-0">
              Previously reviewed access requests
            </p>
          </div>

          <button
            className="btn btn-outline-dark btn-sm px-3"
            onClick={() => navigate("/me")}
          >
            ← Back
          </button>

        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <h5 className="mb-2">No History Found</h5>
              <p className="text-muted mb-0">
                No role requests have been reviewed yet
              </p>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {requests.map((request) => (
              <div
                className="card border-0 shadow-sm"
                key={request.id}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">

                    <div className="flex-grow-1">
                      <div className="mb-2">
                        <h5 className="fw-semibold mb-0">
                          {request.first_name} {request.last_name}
                        </h5>
                        <span className="text-muted small">
                          {request.username}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-secondary px-3 py-2">
                          {request.current_role}
                        </span>
                        <span className="text-muted">→</span>
                        <span className="badge bg-primary px-3 py-2">
                          {request.requested_role}
                        </span>
                      </div>

                      <div className="small text-muted">
                        <div>
                          Reviewed By:{" "}
                          <span className="fw-medium text-dark">
                            {request.reviewed_by || "—"}
                          </span>
                        </div>
                        <div>
                          Reviewed At:{" "}
                          <span className="fw-medium text-dark">
                            {formatDateTime(request.reviewed_at) || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`badge px-3 py-2 ${getBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      {Toast}
    </div>
  );
}

export default RoleRequestHistory;