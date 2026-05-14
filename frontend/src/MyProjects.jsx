import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/projects/?owner=${userId}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div style={{ width: "60%" }}>
        <div className="w-100 mb-3">
          <button
            className="btn btn-link text-decoration-none text-secondary fw-semibold"
            onClick={() => navigate("/me")}
          >
            {"← Profile"}
          </button>
        </div>

        <div className="mb-4">
          <h2 className="fw-bold mb-1">My Projects</h2>
          <p className="text-muted mb-0">Your workspace — all projects owned by you</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-5 border rounded bg-light">
            <h5 className="mb-2">No Projects Found</h5>
            <p className="text-muted mb-0">You don't have any projects yet.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card border-0 shadow-sm"
                style={{ cursor: "pointer", transition: "0.2s" }}
                onClick={() =>
                  navigate(`/projects/${project.id}`, {
                    state: {
                      projectId: project.id,
                      projectName: project.name,
                      projectOwner: project.owner,
                      projectDescription: project.description,
                    },
                  })
                }
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-semibold text-primary">{project.name}</h5>
                    <small className="text-muted">{project.description || "No description"}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-light text-dark border mb-1">
                      {project.owner_name || "Unknown"}
                    </span>
                    {project.owner_id === Number(userId) && (
                      <div>
                        <span className="badge bg-info text-dark">You</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
