import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from './axios';
import { useToast } from './useToast';
import { useDebounce } from './useDebounce';
import { PAGE_SIZE, STATUS_LABEL, STATUS_BADGE_COLOR, STATUS_PROGRESS_COLOR } from './constants';

function ProjectDetail() {
  const { showToast, Toast } = useToast();
  const [kpis, setKpis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = PAGE_SIZE;

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [projectName, setProjectName] = useState(
    location.state?.projectName || "Loading Project..."
  );
  const [projectOwner, setProjectOwner] = useState("Loading Owner...");
  const [projectOwnerId, setProjectOwnerId] = useState(
    location.state?.projectOwner || null
  );
  const [projectDescription, setProjectDescription] = useState(
    location.state?.projectDescription || "Loading Description..."
  );

  const projectId = location.state?.projectId || id;

  const userId = localStorage.getItem("user_id");

  const isMyProject = Number(projectOwnerId) === Number(userId);

  const isMyKpi = (kpi) => kpi.owner_id === Number(localStorage.getItem("user_id"));

  const fetchKPIList = () => {
    api.get(`/api/kpis?project_id=${projectId}`)
      .then((data) => {
        setKpis(data.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error fetching KPIs:", error);
      });
  };

  const handleDeleteProject = async () => {
    const role = localStorage.getItem("role");
    if (role === "VIEWER") {
      showToast("You are not allowed to delete this project", "danger");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This will also delete all related KPIs."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/projects/${projectId}/`);
      navigate("/projects");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const fetchProjectDetails = () => {
    api.get(`/api/projects/${id}/`)
      .then((data) => {
        setProjectName(data.data.name || "Unknown Project");
        setProjectOwner(data.data.owner_name || "Unknown Owner");
        setProjectOwnerId(data.data.owner);
        setProjectDescription(data.data.description || "No Description");
      })
      .catch((error) => {
        console.error(error);
        setProjectName("Project Not Found");
      });
  };

  useEffect(() => {
    fetchKPIList();
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // 1. Injects absolute serial numbers based on original fetch sequence before filtering
  const kpisWithIndexes = kpis.map((kpi, idx) => ({
    ...kpi,
    absoluteIndex: idx + 1,
  }));

  // 2. Evaluates filters against the newly formatted data array
  const filteredKpis = kpisWithIndexes.filter((kpi) => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      (kpi.name?.toLowerCase() || "").includes(searchLower) ||
      (kpi.owner?.toLowerCase() || "").includes(searchLower) ||
      (kpi.description?.toLowerCase() || "").includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentKpis = filteredKpis.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKpis.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/projects")}
              >
                {"← Back to Projects"}
              </button>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role !== "ADMIN") {
                      showToast("Only admins are allowed to delete projects", "danger");
                      return;
                    }
                    handleDeleteProject();
                  }}
                >
                  Delete Project
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role === "VIEWER") {
                      showToast("You are not authorized to edit projects", "danger");
                      return;
                    }
                    navigate("/create", {
                      state: {
                        isEdit: true,
                        projectId: projectId,
                        project: {
                          name: projectName,
                          owner_name: projectOwner,
                          description: projectDescription,
                        },
                        kpis: kpis,
                      },
                    });

                  }}
                >
                  Edit Project
                </button>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-between align-items-start flex-wrap gap-2">

              <div>

                <h2 className="mb-2">
                  Project Detail
                </h2>

                <p className="text-muted mb-0">
                  Manage and track your project details and KPIs here.
                </p>

              </div>

              {isMyProject && (

<div className="badge bg-info-subtle text-secondary border border-info px-3 py-2 fs-6 mb-1">
* Belongs to you
</div>

              )}

            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <h5 className="card-header bg-light text-secondary">
              {projectName}
            </h5>
            <div className="card-body">
              <h5 className="card-title">
                Owner:{' '}
                <span className="text-primary"> {projectOwner} </span>
              </h5>
              <p className="card-text text-dark"> {projectDescription} </p>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search KPIs by name, owner, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0"> List of KPIs </h4>
            <small className="text-muted">
              {filteredKpis.length === 0
                ? "0 - 0 of 0"
                : `${indexOfFirstItem + 1} - ${Math.min(
                  indexOfLastItem,
                  filteredKpis.length
                )} of ${filteredKpis.length}`}
            </small>
          </div>

          <div className="row">

            {currentKpis.map((kpi, index) => {

              const current =
                Number(kpi.current_value) || 0;

              const target =
                Number(kpi.target_value) || 0;

              const percentage =
                target > 0
                  ? Math.min(
                    Math.round((current / target) * 100),
                    100
                  )
                  : 0;


              return (

                <div
                  className="col-12 col-lg-6 mb-4"
                  key={kpi.id || index}
                >

                  <div className="card shadow-sm h-100">

                    {/* HEADER */}
                    <h5 className="card-header bg-light text-secondary">

                      {kpi.absoluteIndex}. {kpi.name}

                    </h5>

                    <div className="card-body">

                      {/* TOP */}
                      <div className="d-flex justify-content-between align-items-center mb-3">

                        <h5 className="card-title text-muted mb-0 small">

                          Owner:{' '}

                          <span className="text-dark fw-semibold">
                            {kpi.owner_name}
                          </span>

                        </h5>

                        <span
                          className={`badge px-3 py-2 rounded-pill fw-semibold ${STATUS_BADGE_COLOR[kpi.status]}`}
                        >

                          {STATUS_LABEL[kpi.status]}

                        </span>

                      </div>

                      {/* DESCRIPTION */}
                      <div className="d-flex justify-content-between align-items-start mb-4">

                        <p className="text-dark mb-0">
                          {kpi.description}
                        </p>

                        {isMyKpi(kpi) && (
                          <div className="text-end">
                            <div className="badge bg-info-subtle text-secondary border border-info px-3 py-2 fs-6 mb-1">
                              * Belongs to you
                            </div>
                          </div>
                        )}

                      </div>

                      {/* METRICS */}
                      <div className="p-3 bg-light rounded-3 border">

                        <div className="row text-center g-2">

                          <div className="col-6 border-end">

                            <span className="text-muted small">
                              Current Value
                            </span>

                            <div className="fs-4">
                              {kpi.current_value}
                            </div>

                          </div>

                          <div className="col-6">

                            <span className="text-muted small">
                              Target Value
                            </span>

                            <div className="fs-4 text-primary">
                              {kpi.target_value}
                            </div>

                          </div>

                        </div>

                        {/* PROGRESS */}
                        <div className="mt-3">

                          <div className="d-flex justify-content-between small text-muted mb-1">

                            <span>Progress</span>

                            <span>{percentage}%</span>

                          </div>

                          <div
                            className="progress"
                            style={{ height: '8px' }}
                          >

                            <div
                              className={`progress-bar ${STATUS_PROGRESS_COLOR[kpi.status]}`}
                              style={{
                                width: `${percentage}%`
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

          {filteredKpis.length === 0 && (
            <div className="text-center p-5 border rounded bg-light">
              No matching KPIs found.
            </div>
          )}

          {filteredKpis.length > ITEMS_PER_PAGE && (
            <div className="d-flex justify-content-center gap-2 mt-3">
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
                disabled={currentPage === totalPages || filteredKpis.length === 0}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {Toast}
    </div>
  );
}

export default ProjectDetail;
