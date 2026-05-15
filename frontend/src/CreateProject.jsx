import React, { useState } from 'react';
import {
  useNavigate,
  useLocation
} from 'react-router-dom';
import api from './axios';
import { getOwnerName } from './constants';
function CreateProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const projectId = location.state?.projectId;

  const [project, setProject] = useState(
    location.state?.project || {
      name: "",
      owner_name: getOwnerName(),
      description: "",
    }
  );
  const [kpis, setKpis] = useState(
    (location.state?.kpis || []).map(kpi => ({
      ...kpi,
      is_min_kpi: kpi.is_min_kpi ?? false
    }))
  );
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const addKPICard = () => {
    setKpis(prev => [
      ...prev,
      {
        name: '',
        description: '',
        current_value: '',
        target_value: '',
        owner: getOwnerName(),
        status: '2',
        is_min_kpi: false
      }
    ]);
  };
  const removeKPICard = (indexToRemove) => {
    setKpis(prev =>
      prev.filter((_, index) =>
        index !== indexToRemove
      )
    );
  };
  const handleKPIChange = (
    index,
    field,
    value
  ) => {
    setKpis(prev =>
      prev.map((kpi, idx) => {
        if (idx === index) {
          return {
            ...kpi,
            [field]: value
          };
        }
        return kpi;
      })
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedKpis = kpis.map((kpi) => ({
      ...kpi,
      current_value: parseInt(kpi.current_value, 10),
      target_value: parseInt(kpi.target_value, 10),
      status: parseInt(kpi.status, 10),
      is_min_kpi: !!kpi.is_min_kpi 
    }));
    const payload = {
      name: project.name,
      description: project.description,
      kpis: formattedKpis
    };
    if (isEdit) {
      api.put(`/api/projects/${projectId}/`, payload)
        .then(() => {
          navigate(`/projects/${projectId}`);
        })
        .catch((error) => {
          console.error('Error updating project:', error);
        });
    } else {
      api.post('/api/projects/', payload)
        .then((response) => {
          navigate(`/projects/${response.data.id}`);
        })
        .catch((error) => {
          console.error('Error creating project:', error);
        });
    }
  };
  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <nav
            aria-label="breadcrumb"
            className="mb-3"
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a
                  href="/projects"
                  className="text-decoration-none"
                >
                  Dashboard
                </a>
              </li>
              <li
                className="breadcrumb-item active"
                aria-current="page"
              >
                {isEdit
                  ? 'Edit Project'
                  : 'Create New Project'}
              </li>
            </ol>
          </nav>
          <h2 className="mb-2 fw-bold text-dark">
            {isEdit
              ? 'Edit Project'
              : 'Create New Project'}
          </h2>
          <p className="text-muted mb-4">
            {isEdit
              ? 'Update project details and KPI tracking.'
              : 'Set up your Project Details and establish baseline tracked KPIs.'}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm mb-4 rounded-3">
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label small text-muted text-uppercase fw-semibold">
                    Project Name
                    <span className="text-danger">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg fs-6"
                    placeholder="e.g., Q2 Marketing Campaign"
                    value={project.name}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted text-uppercase fw-semibold">
                    Project Owner
                    <span className="text-danger">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="owner"
                    className="form-control"
                    placeholder=""
                    value={project.owner_name ?? project.owner ?? getOwnerName()}
                    onChange={handleProjectChange}
                    required
                    disabled
                  />
                </div>
                <div className="mb-0">
                  <label className="form-label small text-muted text-uppercase fw-semibold">
                    Description
                    <span className="text-danger">
                      *
                    </span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Provide project summary..."
                    value={project.description}
                    onChange={handleProjectChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
              <h4 className="fw-bold text-dark m-0">
                Key Performance Indicators
                <span className="text-muted fs-6 fw-normal">
                  {' '} (Optional)
                </span>
              </h4>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                onClick={addKPICard}
              >
                + Add KPI Metric
              </button>
            </div>
            {kpis.map((kpi, index) => (
              <div
                className="card border-0 shadow-sm mb-4 rounded-3 border-start border-primary border-3"
                key={index}
              >
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                  <span className="fw-bold text-secondary small text-uppercase">
                    KPI Node #{index + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-close small"
                    aria-label="Remove KPI"
                    onClick={() =>
                      removeKPICard(index)
                    }
                  ></button>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-medium">
                        KPI Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={kpi.name}
                        onChange={(e) =>
                          handleKPIChange(
                            index,
                            'name',
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-medium">
                        KPI Owner
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={getOwnerName()}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-medium">
                      Metric Description
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={kpi.description}
                      onChange={(e) =>
                        handleKPIChange(
                          index,
                          'description',
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-4">
                      <label className="form-label small text-muted fw-medium">
                        Current Value (Numeric)
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-control"
                        value={kpi.current_value}
                        onChange={(e) => {
                          const value =
                            e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleKPIChange(
                              index,
                              'current_value',
                              value
                            );
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-muted fw-medium">
                        Target Value (Numeric)
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-control"
                        value={kpi.target_value}
                        onChange={(e) => {
                          const value =
                            e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleKPIChange(
                              index,
                              'target_value',
                              value
                            );
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-muted fw-medium">
                        Initial Status
                      </label>
                      <select
                        className="form-select"
                        value={kpi.status}
                        onChange={(e) =>
                          handleKPIChange(
                            index,
                            'status',
                            e.target.value
                          )
                        }
                      >
                        <option value="2">
                          On Track
                        </option>
                        <option value="1">
                          Off Track
                        </option>
                        <option value="0">
                          At Risk
                        </option>
                      </select>
                    </div>

                    <div className="col-12 mt-2">
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      checked={kpi.is_min_kpi || false}
      onChange={(e) =>
        handleKPIChange(
          index,
          'is_min_kpi',
          e.target.checked
        )
      }
      style={{border: '1px solid black'}}
      id={`minKpi-${index}`}
    />
    <label
      className="form-check-label small text-muted fw-medium"
      htmlFor={`minKpi-${index}`}
    >
      Is this a MINIMIZE KPI? (lower value is better)
    </label>
  </div>
</div>
                  </div>
                </div>
              </div>
            ))}
            {kpis.length === 0 && (
              <div className="text-center p-4 border rounded-3 bg-white mb-4 text-muted small">
                No KPIs linked yet.
                Click "+ Add KPI Metric"
                to begin attaching target parameters.
              </div>
            )}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-light px-4 border"
                onClick={() =>
                  navigate(-1)
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-5 fw-semibold"
              >
                {isEdit
                  ? 'Update Project'
                  : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateProject;