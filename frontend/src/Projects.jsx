import React, { useState, useEffect } from 'react';
import api from './axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { useDebounce } from './useDebounce';
import { PAGE_SIZE } from './constants';

function Projects() {
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const role = localStorage.getItem("role");
  const ITEMS_PER_PAGE = PAGE_SIZE;
  const [fetchedDataOrNot, setFetchedDataOrNot] = useState(false);

  const fetchProjectList = (query = "") => {
    api.get(`/api/projects/?search=${query}`)
      .then((data) => {
        setProjects(data.data);
        setCurrentPage(1);
      })
      .catch((err) => console.error(err))
      .finally(setFetchedDataOrNot(true))
  };

  useEffect(() => {
    fetchProjectList(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [projects]);

  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));
  const safeStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(safeStart, safeStart + ITEMS_PER_PAGE);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">
          <div className="mt-2 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/")}
              >
                {"← Home"}
              </button>
              <div className="text-center">
                <h3 className="fw-bold mb-0">Projects Dashboard</h3>
                <p className="text-muted">Manage and track your active workspace projects here.</p>
              </div>
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/kpis")}
              >
                {"KPIs →"}
              </button>
            </div>
          </div>

          <div className="mb-3 d-flex align-items-center gap-2 flex-nowrap">
            <input
              type="text"
              className="form-control"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-success text-nowrap"
              onClick={() => {
                if (role === "VIEWER") {
                  showToast("You are not allowed to create projects", "danger");
                  return;
                }
                navigate("/create");
              }}
            >
              Create Project
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              Showing{" "}
              {projects.length === 0 ? 0 : safeStart + 1}{" "}
              -{" "}
              {Math.min(safeStart + ITEMS_PER_PAGE, projects.length)}{" "}
              of {projects.length}
            </small>
          </div>

          {currentProjects.map((project) => (
            <div className="card mb-4 shadow-sm" key={project.id}>
              <div className="card-header bg-light text-secondary d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{project.name}</span>
                <span className="badge bg-primary-subtle text-primary border border-primary rounded-pill px-3 py-2">
                  {project.kpis?.length || 0} KPIs
                </span>
              </div>
              <div className="card-body">
                <h6 className="card-title">
                  Owner: <span className="text-primary">{project.owner_name}</span>
                </h6>
                <p className="card-text text-dark">{project.description}</p>
                <div className="d-flex justify-content-end">
                  <Link
                    to={`/projects/${project.id}`}
                    state={{
                      projectName: project.name,
                      projectId: project.id,
                      projectOwner: project.owner,
                      projectDescription: project.description,
                    }}
                    className="btn btn-outline-primary"
                  >
                    Go to project
                  </Link>
                </div>
              </div>
            </div>
          ))}

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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {!fetchedDataOrNot && projects.length === 0 && (
            <div className="text-center p-5 border rounded bg-light">
              <p className="text-muted m-0">No active workspace projects found.</p>
            </div>
          )}
        </div>
      </div>
      {Toast}
    </div>
  );
}

export default Projects;
