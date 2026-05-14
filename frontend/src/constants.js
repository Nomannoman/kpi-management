export const PAGE_SIZE = 5;

export const STATUS_LABEL = {
    0: 'At Risk',
    1: 'Off Track',
    2: 'On Track',
};

export const STATUS_BADGE_COLOR = {
    0: 'bg-danger-subtle text-danger border border-danger',
    1: 'bg-warning-subtle text-warning-emphasis border border-warning',
    2: 'bg-success-subtle text-success border border-success',
};

export const STATUS_PROGRESS_COLOR = {
    0: 'bg-danger',
    1: 'bg-warning',
    2: 'bg-success',
};

export const getOwnerName = () => {
    const firstName = localStorage.getItem("first_name") || "";
    const lastName = localStorage.getItem("last_name") || "";
    return [firstName, lastName].filter(Boolean).join(" ");
};
