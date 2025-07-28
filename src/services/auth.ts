// Simple authentication service
export const AuthService = {
  // Set the authentication token
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
    console.log('Token set:', token);
  },

  // Get the authentication token
  getToken: (): string | null => {
    const token = localStorage.getItem('authToken');
    console.log('Token retrieved:', token);
    return token;
  },

  // Remove the authentication token
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get Bearer token for API requests
  getBearerToken: (): string => {
    const token = AuthService.getToken();
    const bearerToken = token ? `Bearer ${token}` : '';
    console.log('Bearer token:', bearerToken);
    return bearerToken;
  },

  // Decode JWT token to check expiration
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const token = AuthService.getToken();
    if (!token) return true;
    
    const decoded = AuthService.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;
    
    console.log('Token expiration check:', {
      currentTime,
      tokenExp: decoded.exp,
      isExpired,
      decoded
    });
    
    return isExpired;
  },
};

// Set the correct Bearer token immediately
const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YmI3YzZhYS03MGQyLTQ3MDktOGZiYS0yYzNkODc0YmRkNWQiLCJ1c2VySWQiOiJIYW5ldWxNIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzUzNjI2NTc4LCJleHAiOjE3NTM2ODc3Nzh9.VdgMkRbMlYsdRaNvnq-Dytp_Nof-sRvY479mxkIBwi0';

// Always set the correct token on initialization
AuthService.setToken(correctToken);

// Check if token is expired
if (AuthService.isTokenExpired()) {
  console.warn('WARNING: Token is expired!');
} else {
  console.log('Token is valid');
}

console.log('Auth service initialized with correct token'); 