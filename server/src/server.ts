import 'dotenv/config';
import app from './index.js';
import posthog from './config/posthog.js';

const port = process.env.PORT || 5000;

process.on('SIGTERM', async () => {
  await posthog.shutdown()
  process.exit(0)
})

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});