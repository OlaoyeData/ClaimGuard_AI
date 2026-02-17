// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (!isStrongPassword(password)) return 'medium';
    return 'strong';
};

// Required field validation
export const isRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

// File validation
export const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
};
