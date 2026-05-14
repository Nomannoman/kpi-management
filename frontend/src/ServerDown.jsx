import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

function ServerDown() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    try {
      setChecking(true);
      await api.get("/api/users/health/");
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="text-center">
        <h1 className="display-4 fw-bold text-danger">Server Unavailable</h1>
        <p className="text-muted mt-3">The backend server is currently down or unreachable.</p>
        <button
          className="btn btn-primary mt-3"
          onClick={handleRetry}
          disabled={checking}
        >
          {checking ? "Checking..." : "Retry"}
        </button>
      </div>
    </div>
  );
}

export default ServerDown;
