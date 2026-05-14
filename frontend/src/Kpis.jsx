import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';
import { useDebounce } from './useDebounce';
import { PAGE_SIZE, STATUS_LABEL, STATUS_BADGE_COLOR, STATUS_PROGRESS_COLOR } from './constants';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Kpis() {
  const navigate = useNavigate();
  const [allKpis, setAllKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = PAGE_SIZE;
  const [stats, setStats] = useState({ total: 0, onTrack: 0, offTrack: 0, atRisk: 0 });

  useEffect(() => {
    api.get('/api/projects/')
      .then((response) => {
        const projectsData = response.data || [];
        const extractedKpis = [];

        projectsData.forEach((project) => {
          if (project.kpis) {
            project.kpis.forEach((kpi) => {
              extractedKpis.push({
                ...kpi,
                project_id: project.id,
                project_name: project.name,
                originalIndex: extractedKpis.length + 1,
              });
            });
          }
        });

        setAllKpis(extractedKpis);
        setStats({
          total: extractedKpis.length,
          onTrack: extractedKpis.filter((kpi) => kpi.status === 2).length,
          offTrack: extractedKpis.filter((kpi) => kpi.status === 1).length,
          atRisk: extractedKpis.filter((kpi) => kpi.status === 0).length,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const filteredKpis = allKpis.filter((kpi) => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      kpi.name?.toLowerCase().includes(query) ||
      kpi.project_name?.toLowerCase().includes(query) ||
      kpi.owner?.toLowerCase().includes(query) ||
      kpi.description?.toLowerCase().includes(query)
    );
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentKpis = filteredKpis.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKpis.length / ITEMS_PER_PAGE);

  const chartData = [
    { name: 'On Track', value: stats.onTrack, color: '#198754' },
    { name: 'Off Track', value: stats.offTrack, color: '#ffc107' },
    { name: 'At Risk', value: stats.atRisk, color: '#dc3545' },
  ];

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="mt-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/")}
              >
                {"← Home"}
              </button>
              <div className="text-center">
                <h2 className="fw-bold mb-0">KPI Analytics</h2>
                <p className="text-muted mb-0">Monitor KPI performance across all projects.</p>
              </div>
              <button
                className="btn btn-link text-decoration-none text-secondary fw-semibold"
                onClick={() => navigate("/projects")}
              >
                {"Projects →"}
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <h3 className="fw-bold">{stats.total}</h3>
                  <small className="text-muted">Total KPIs</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <h3 className="fw-bold text-success">{stats.onTrack}</h3>
                  <small className="text-muted">On Track</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <h3 className="fw-bold text-warning">{stats.offTrack}</h3>
                  <small className="text-muted">Off Track</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <h3 className="fw-bold text-danger">{stats.atRisk}</h3>
                  <small className="text-muted">At Risk</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">KPI Status Distribution</h5>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                <h5 className="fw-bold mb-0">KPI Records</h5>
                <div className="flex-grow-1 mx-sm-3" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search name, owner, description..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <span className="text-muted small">
                  Showing{" "}
                  {filteredKpis.length === 0 ? 0 : indexOfFirstItem + 1}{" "}
                  -{" "}
                  {Math.min(indexOfLastItem, filteredKpis.length)}{" "}
                  of {filteredKpis.length}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5 text-muted">Loading KPIs...</div>
              ) : filteredKpis.length === 0 ? (
                <div className="text-center py-5 text-muted">No KPI records available.</div>
              ) : (
                currentKpis.map((kpi, index) => {
                  const percentage = kpi.target_value > 0
                    ? Math.min(Math.round((kpi.current_value / kpi.target_value) * 100), 100)
                    : 0;
                  return (
                    <div key={kpi.id || index} className="border rounded bg-light p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="w-100">
                          <h6 className="fw-bold mb-1">{kpi.originalIndex}. {kpi.name}</h6>
                          <small className="text-primary d-block mb-2">Project: {kpi.project_name}</small>
                          <p className="text-muted small mb-2">{kpi.description}</p>
                          <small className="text-secondary d-block mb-3">Owner: {kpi.owner}</small>
                          <div className="d-flex gap-4 small mb-2">
                            <span><strong>Current:</strong> {kpi.current_value}</span>
                            <span><strong>Target:</strong> {kpi.target_value}</span>
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
                            onClick={() => navigate(`/projects/${kpi.project_id}`, {
                              state: { projectId: kpi.project_id, projectName: kpi.project_name },
                            })}
                          >
                            Go To Project
                          </button>
                        </div>
                        <div className="ms-3">
                          <span className={`badge px-3 py-2 ${STATUS_BADGE_COLOR[kpi.status]}`}>
                            {STATUS_LABEL[kpi.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {filteredKpis.length > ITEMS_PER_PAGE && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kpis;
