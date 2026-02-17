// Format date to readable string
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateString);
};

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// Get status label
export const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
        info_requested: 'Information Requested',
    };
    return labels[status] || status;
};

// Get damage type label
export const getDamageTypeLabel = (damageType: string): string => {
    const labels: Record<string, string> = {
        none: 'No Damage',
        minor: 'Minor Damage',
        moderate: 'Moderate Damage',
        severe: 'Severe Damage',
    };
    return labels[damageType] || damageType;
};
