/**
 * Validation utility for the Tamil Heritage App
 */

/**
 * Validates name: Only alphabets and spaces, min 3 chars
 */
export const validateName = (name) => {
    if (!name || name.trim().length < 3) return 'Name must be at least 3 characters.';
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) return 'Name can only contain alphabets and spaces.';
    return null;
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return null;
};

/**
 * Validates password: Min 6 characters, 1 upper, 1 lower, 1 number
 */
export const validatePassword = (password) => {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpper || !hasLower || !hasNumber) {
        return 'Password must include uppercase, lowercase, and a number.';
    }
    return null;
};

/**
 * Validates if passwords match
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
};

/**
 * Validates phone: Exactly 10 digits
 */
export const validatePhone = (phone) => {
    if (!phone) return null; // Optional but if provided must be valid
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) return 'Phone number must be exactly 10 digits.';
    return null;
};
