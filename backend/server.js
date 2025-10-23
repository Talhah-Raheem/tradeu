const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TradeU backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test Supabase connection (only if env vars are set)
app.get('/api/test-db', async (req, res) => {
  try {
    const { supabase } = require('./lib/supabase');
    const { data, error } = await supabase.from('_health').select('*').limit(1);
    res.json({
      status: 'connected',
      message: 'Supabase connection successful'
    });
  } catch (err) {
    res.json({
      status: 'not configured',
      message: 'Add Supabase credentials to backend/.env to enable database features',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TradeU backend running on http://localhost:${PORT}`);
});
