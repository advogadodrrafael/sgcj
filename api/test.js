export default async function handler(req, res) {
  try {
    console.log('Test endpoint called');
    console.log('Environment variables:', {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'set' : 'not set',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
    });
    res.json({ status: 'ok', message: 'Test endpoint works' });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
}
