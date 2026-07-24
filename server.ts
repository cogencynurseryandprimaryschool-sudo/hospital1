import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve SQL Schema file for easy downloading/copying in Admin setup
  app.get('/api/schema.sql', (_req, res) => {
    try {
      const schemaPath = path.join(process.cwd(), 'supabase_schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.send(sql);
      } else {
        res.status(404).json({ error: 'Schema file not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PAYSTACK SECURE PAYMENT INITIALIZATION ENDPOINT
  // Never expose PAYSTACK_SECRET_KEY to the browser client!
  app.post('/api/paystack/initialize', async (req, res) => {
    try {
      const { email, amount, invoiceId, invoiceNumber, callbackUrl } = req.body;

      if (!email || !amount || !invoiceId) {
        return res.status(400).json({ status: false, message: 'Missing required parameters: email, amount, invoiceId' });
      }

      const secretKey = process.env.PAYSTACK_SECRET_KEY;
      const koboAmount = Math.round(Number(amount) * 100);
      const reference = `PST_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      if (secretKey && !secretKey.includes('xxxxxxxx')) {
        // Real Paystack API call
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            amount: koboAmount,
            reference,
            callback_url: callbackUrl || `${process.env.APP_URL || 'http://localhost:3000'}/`,
            metadata: {
              invoiceId,
              invoiceNumber,
              custom_fields: [
                { display_name: 'Invoice Number', variable_name: 'invoice_number', value: invoiceNumber }
              ]
            }
          })
        });

        const data = await response.json();
        return res.json(data);
      } else {
        // Fallback simulated paystack transaction for test & preview environments
        return res.json({
          status: true,
          message: 'Authorization URL created (Sandbox mode)',
          data: {
            authorization_url: '#paystack-simulated-modal',
            access_code: `acc_${Math.random().toString(36).substring(7)}`,
            reference
          }
        });
      }
    } catch (error: any) {
      console.error('Paystack initialization error:', error);
      res.status(500).json({ status: false, message: error.message || 'Internal payment error' });
    }
  });

  // PAYSTACK TRANSACTION VERIFICATION ENDPOINT
  app.post('/api/paystack/verify', async (req, res) => {
    try {
      const { reference } = req.body;

      if (!reference) {
        return res.status(400).json({ status: false, message: 'Reference is required' });
      }

      const secretKey = process.env.PAYSTACK_SECRET_KEY;

      if (secretKey && !secretKey.includes('xxxxxxxx')) {
        // Real Paystack API verification call
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${secretKey}`
          }
        });

        const data = await response.json();
        return res.json(data);
      } else {
        // Simulated sandbox verification for testing workflow
        return res.json({
          status: true,
          message: 'Verification successful (Sandbox mode)',
          data: {
            status: 'success',
            reference,
            amount: 2700000,
            channel: 'card',
            currency: 'NGN',
            paid_at: new Date().toISOString()
          }
        });
      }
    } catch (error: any) {
      console.error('Paystack verification error:', error);
      res.status(500).json({ status: false, message: error.message || 'Verification failed' });
    }
  });

  // Vite development middleware or static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hospital Management System running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
