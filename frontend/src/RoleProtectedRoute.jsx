import { useEffect, useState } from "react";

function RoleProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const isAuthorized = allowedRoles.includes(role);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isAuthorized) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "600",
            color: "#666",
          }}
        >
          Access restricted
        </div>
        {showToast && (
          <div
            className="position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 9999 }}
          >
            <div className="alert alert-danger shadow">
              You are not authorized to view this page
            </div>
          </div>
        )}
      </>
    );
  }

  return children;
}

export default RoleProtectedRoute;
