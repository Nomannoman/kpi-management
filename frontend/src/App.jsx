import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './axios';
import Projects from './Projects';
import Analytics from './Analytics';
import Kpis from './Kpis';
import ProjectDetail from './ProjectDetail';
import ErrorPage from './ErrorPage';
import CreateProject from './CreateProject';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import UserProfile from './UserProfile';
import RoleChangeRequests from './RoleChangeRequests';
import RoleRequestHistory from './RoleRequestHistory';
import ServerDown from './ServerDown';
import UserManagement from './UserManagement';
import MyProjects from './MyProjects';
import MyKPIs from './MyKPIs';

function App() {
  const [checkingServer, setCheckingServer] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/server-down") {
      setCheckingServer(false);
      return;
    }

    api.get("/api/users/health/")
      .then(() => {
        setCheckingServer(false);
      })
      .catch((err) => {
        console.error(err);
        window.location.href = "/server-down";
      });
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      window.location.href = "/login";
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  if (checkingServer) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <div className="text-muted">Connecting to server...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/server-down" element={<ServerDown />} />

        <Route path="/" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/myprojects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
        <Route path="/mykpis" element={<ProtectedRoute><MyKPIs /></ProtectedRoute>}/>
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/kpis" element={<ProtectedRoute><Kpis /></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route
          path="/create"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <CreateProject />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/usermanagement"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/rolerequests"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <RoleChangeRequests />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/rolerequesthistory"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'VIEWER']}>
              <RoleRequestHistory />
            </RoleProtectedRoute>
          }
        />

        <Route path="/errorpage" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
