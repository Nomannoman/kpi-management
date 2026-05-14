import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading this page.',
  buttonText = 'Go Back Home',
  buttonLink = '/',
  showRetry = true,
}) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)',
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-5 text-center p-4 p-md-5"
        style={{
          maxWidth: '650px',
          width: '100%',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: '110px',
            height: '110px',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          }}
        >
          <i className="bi bi-exclamation-triangle-fill display-4" style={{ color: '#dc2626' }}></i>
        </div>

        <h1 className="fw-bold text-dark mb-3">{title}</h1>

        <p
          className="text-muted fs-5 mx-auto mb-4"
          style={{ maxWidth: '500px', lineHeight: '1.8' }}
        >
          {message}
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to={buttonLink} className="btn btn-dark btn-lg rounded-pill px-4">
            <i className="bi bi-house-door me-2"></i>
            {buttonText}
          </Link>
          {showRetry && (
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline-secondary btn-lg rounded-pill px-4"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
