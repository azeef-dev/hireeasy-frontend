// Centralised, reusable validation helpers for every form in the app.

export const validateName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return 'Full name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    if (trimmed.length > 50) return 'Name must be under 50 characters';
    if (!/^[A-Za-z\s'.-]+$/.test(trimmed)) return 'Name can only contain letters and spaces';
    return '';
};

export const validateEmail = (email) => {
    const trimmed = (email || '').trim();
    if (!trimmed) return 'Email is required';
    if (/\s/.test(trimmed)) return 'Email cannot contain spaces';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return 'Enter a valid email address';
    return '';
};

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (/\s/.test(password)) return 'Password cannot contain spaces';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 100) return 'Password is too long';
    return '';
};

export const validatePhone = (phone, required = false) => {
    const trimmed = (phone || '').trim();
    if (!trimmed) return required ? 'Phone number is required' : '';
    if (!/^[0-9+\-\s]{7,15}$/.test(trimmed)) return 'Enter a valid phone number (digits only)';
    if (!/\d{7,}/.test(trimmed.replace(/[^0-9]/g, ''))) return 'Phone number must have at least 7 digits';
    return '';
};

export const validateRequiredText = (value, fieldName, min = 2, max = 100) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return `${fieldName} is required`;
    if (trimmed.length < min) return `${fieldName} must be at least ${min} characters`;
    if (trimmed.length > max) return `${fieldName} must be under ${max} characters`;
    return '';
};

export const validateCategory = (value) => {
    if (!value || !value.trim()) return 'Please select a service category';
    return '';
};

export const validateNumber = (value, fieldName, { min = 0, max = 1000000, required = false } = {}) => {
    if (value === '' || value === undefined || value === null) {
        return required ? `${fieldName} is required` : '';
    }
    const num = Number(value);
    if (Number.isNaN(num)) return `${fieldName} must be a valid number`;
    if (num < min) return `${fieldName} must be at least ${min}`;
    if (num > max) return `${fieldName} must be under ${max}`;
    return '';
};

export const validateMessage = (value, min = 10, max = 1000) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return 'Message is required';
    if (trimmed.length < min) return `Message must be at least ${min} characters`;
    if (trimmed.length > max) return `Message must be under ${max} characters`;
    return '';
};

// Strips anything that isn't a digit/+/-/space — used on phone inputs as you type
export const sanitizePhoneInput = (value) => value.replace(/[^0-9+\-\s]/g, '');

// Strips anything that isn't a digit — used on numeric inputs as you type
export const sanitizeDigitsInput = (value) => value.replace(/[^0-9]/g, '');

// Returns true only if the whole form's error map is empty
export const isFormValid = (errors) => Object.values(errors).every((msg) => !msg);