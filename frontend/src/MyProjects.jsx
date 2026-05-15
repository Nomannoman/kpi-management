import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const ITEMS_PER_PAGE = 5;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/projects/?owner=${userId}`);
      setProjects(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">

          <div className="mt-2 mb-3">
            <div className="d-flex justify-content-between align-items-center">

              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/me")}
              >
                {"← Profile"}
              </button>

              <div className="text-center">
                <h3 className="fw-bold mb-0">My Projects</h3>
                <p className="text-muted mb-0">
                  Your workspace — all projects owned by you
                </p>
              </div>

              <div style={{ width: "90px" }} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-5 border rounded bg-light">
              <h5 className="mb-2">No Projects Found</h5>
              <p className="text-muted mb-0">
                You don't have any projects yet.
              </p>
            </div>
          ) : (
            <div>
              {currentProjects.map((project) => (
                <div className="card mb-4 shadow-sm" key={project.id}>

                  <div className="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{project.name}</span>

                    <span className="badge bg-primary-subtle text-primary border border-primary rounded-pill px-3 py-2">
                      {project.kpis?.length || 0} KPIs
                    </span>
                  </div>

                  <div className="card-body">

                    <p className="card-text text-dark">
                      {project.description || "No description"}
                    </p>

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-outline-primary"
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
                        Go to project
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {projects.length > ITEMS_PER_PAGE && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span className="text-muted small">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyProjects;