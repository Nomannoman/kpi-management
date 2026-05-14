import { useState } from "react";

export function useToast() {
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 3000);
    };

    const Toast = toast.show ? (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
                minWidth: "250px",
            }}
            className={`alert alert-${toast.type} shadow`}
        >
            {toast.message}
        </div>
    ) : null;

    return { showToast, Toast };
}
