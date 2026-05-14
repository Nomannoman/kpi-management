import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./axios";

function RoleChangeRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState({
        type: "",
        text: "",
    });

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const totalPages = Math.ceil(requests.length / pageSize);

    const paginatedRequests = requests.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/users/role-requests/");
            setRequests(res.data);
        } catch (err) {
            setStatus({
                type: "danger",
                text: "Failed to load role requests.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        try {
            await api.post(
                `/api/users/role-requests/${requestId}/${action}/`
            );

            setStatus({
                type: "success",
                text: `Request ${action}ed successfully.`,
            });

            setRequests((prev) =>
                prev.filter((req) => req.id !== requestId)
            );
        } catch (err) {
            setStatus({
                type: "danger",
                text: `Failed to ${action} request.`,
            });
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center">

            <div className="w-100" style={{ maxWidth: "60%" }}>

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">Role Requests</h2>
                        <p className="text-muted mb-0">
                            Approve or reject access role changes
                        </p>
                    </div>

                    <div className="d-flex gap-2">

                        <Link
                            to="/me"
                            className="btn btn-outline-dark btn-sm px-3"
                        >
                            ← Profile
                        </Link>

                    </div>

                </div>

                {/* STATUS */}
                {status.text && (
                    <div className={`alert alert-${status.type}`}>
                        {status.text}
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <h5 className="mb-2">No Pending Requests</h5>
                            <p className="text-muted mb-0">
                                Everything is already reviewed 🎉
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* REQUEST LIST */}
                        {paginatedRequests.map((request) => (
                            <div
                                key={request.id}
                                className="card border-0 shadow-sm mb-3"
                            >
                                <div className="card-body">

                                    {/* TOP ROW */}
                                    <div className="d-flex justify-content-between align-items-center">

                                        {/* LEFT */}
                                        <div className="flex-grow-1">

                                            {/* NAME + USERNAME */}
                                            <div className="d-flex align-items-center gap-2 mb-2">

                                                <h5 className="mb-0 fw-semibold">
                                                    {request.first_name} {request.last_name}
                                                </h5>

                                                <span className="text-muted small">
                                                    ({request.username})
                                                </span>

                                            </div>

                                            {/* ROLE COMPARISON */}
                                            <div className="d-flex align-items-center gap-2">

                                                <span className="badge bg-secondary px-3 py-2">
                                                    Current: {request.current_role}
                                                </span>

                                                <span className="text-muted">→</span>

                                                <span className="badge bg-primary px-3 py-2">
                                                    Requested: {request.requested_role}
                                                </span>

                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-success btn-sm px-3"
                                                onClick={() =>
                                                    handleAction(request.id, "approve")
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm px-3"
                                                onClick={() =>
                                                    handleAction(request.id, "reject")
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* PAGINATION */}
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </button>

                            <span className="text-muted small">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RoleChangeRequests;