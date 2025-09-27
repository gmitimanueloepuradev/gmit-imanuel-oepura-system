// Configuration for Capacitor build to handle API routes

export const isCapacitorBuild = process.env.BUILD_TARGET === 'capacitor';

// Mock API responses for Capacitor build
export const mockApiResponse = (data = null, message = 'Static mode - API disabled') => ({
  success: false,
  data,
  message,
  errors: 'API routes disabled in static export',
  timestamp: new Date().toISOString()
});

// Pages that don't require API calls for static export
export const staticPages = [
  '/',
  '/login',
  '/tentang',
  '/sejarah',
  '/galeri',
  '/404'
];

export default {
  isCapacitorBuild,
  mockApiResponse,
  staticPages
};