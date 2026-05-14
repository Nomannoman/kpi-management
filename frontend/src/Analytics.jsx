import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './axios';

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    totalKpis: 0,
    onTrack: 0,
    atRisk: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardMetrics = async () => {
    try {
      const projectsRes = await api.get('/api/projects/');
      const kpisRes = await api.get('/api/kpis/');
      setMetrics({
        totalProjects: projectsRes.data.length,
        totalKpis: kpisRes.data.length,
        onTrack: kpisRes.data.filter((kpi) => kpi.status === 2).length,
        atRisk: kpisRes.data.filter((kpi) => kpi.status === 0).length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted mb-0">Manage projects and monitor KPI performance.</p>
          </div>
          <div>
            <Link to="/me" className="btn btn-outline-dark d-flex align-items-center gap-2">
              <span>👤</span>
              My Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small mb-2">Total Projects</div>
              <h2 className="fw-bold">{loading ? '--' : metrics.totalProjects}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small mb-2">Total KPIs</div>
              <h2 className="fw-bold">{loading ? '--' : metrics.totalKpis}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small mb-2">On Track</div>
              <h2 className="fw-bold text-success">{loading ? '--' : metrics.onTrack}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small mb-2">At Risk</div>
              <h2 className="fw-bold text-danger">{loading ? '--' : metrics.atRisk}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Projects</h4>
              <p className="text-muted">View all projects and manage project details.</p>
              <Link to="/projects" className="btn btn-outline-dark">Go to Projects</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-3">KPIs</h4>
              <p className="text-muted">Track KPI progress and monitor status updates.</p>
              <Link to="/kpis" className="btn btn-outline-dark">Go to KPIs</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
