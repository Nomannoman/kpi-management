import React, { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router-dom";
import {
  PAGE_SIZE,
  STATUS_LABEL,
  STATUS_BADGE_COLOR,
  STATUS_PROGRESS_COLOR
} from "./constants";

function MyKPIs() {
  const navigate = useNavigate();
  const [allKpis, setAllKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = PAGE_SIZE;
  const userId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    api.get("/api/projects/")
      .then((res) => {
        const projects = res.data || [];
        const extracted = [];

        projects.forEach((project) => {
          (project.kpis || []).forEach((kpi) => {
            extracted.push({
              ...kpi,
              project_id: project.id,
              project_name: project.name,
              originalIndex: extracted.length + 1
            });
          });
        });

        const myKpis = extracted.filter(
          (kpi) => Number(kpi.owner) === userId
        );

        setAllKpis(myKpis);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentKpis = allKpis.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allKpis.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">

          <div className="mt-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/me")}
              >
                {"← Profile"}
              </button>

              <div className="text-center">
                <h2 className="fw-bold mb-0">My KPIs</h2>
                <p className="text-muted mb-0">
                  KPIs where you are the owner
                </p>
              </div>

              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/kpis")}
              >
                {"All KPIs →"}
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              {loading ? (
                <div className="text-center py-5 text-muted">
                  Loading KPIs...
                </div>
              ) : allKpis.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No KPIs assigned to you.
                </div>
              ) : (
                currentKpis.map((kpi, index) => {
                  let percentage = 0;

                  const current = Number(kpi.current_value) || 0;
                  const target = Number(kpi.target_value) || 0;

                  if (target > 0 && current > 0) {
                    if (kpi.is_min_kpi) {
                      percentage = (target / current) * 100;
                    } else {
                      percentage = (current / target) * 100;
                    }
                    percentage = Math.min(Math.round(percentage), 100);
                  }

                  return (
                    <div
                      key={kpi.id || index}
                      className="border rounded bg-light p-3 mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">

                        <div className="w-100">

                          <h6 className="fw-bold mb-1">
                            {kpi.originalIndex}. {kpi.name}
                          </h6>

                          <small className="text-primary d-block mb-2">
                            Project: {kpi.project_name}
                          </small>

                          <p className="text-muted small mb-2">
                            {kpi.description}
                          </p>

                          <div className="d-flex gap-4 small mb-2">
                            <span>
                              <strong>Current:</strong> {kpi.current_value}
                            </span>
                            <span>
                              <strong>Target:</strong> {kpi.target_value}
                            </span>
                          </div>

                          <div className="progress mb-3">
                            <div
                              className={`progress-bar ${STATUS_PROGRESS_COLOR[kpi.status]}`}
                              style={{ width: `${percentage}%` }}
                            >
                              {percentage}%
                            </div>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(`/projects/${kpi.project_id}`, {
                                state: {
                                  projectId: kpi.project_id,
                                  projectName: kpi.project_name
                                }
                              })
                            }
                          >
                            Go To Project
                          </button>

                        </div>

                        <div className="ms-3">
                          <span
                            className={`badge px-3 py-2 ${STATUS_BADGE_COLOR[kpi.status]}`}
                          >
                            {STATUS_LABEL[kpi.status]}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}

              {allKpis.length > ITEMS_PER_PAGE && (
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
      </div>
    </div>
  );
}

export default MyKPIs;