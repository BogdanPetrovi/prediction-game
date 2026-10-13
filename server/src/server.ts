import 'dotenv/config';
import app from './index.js';
import posthog from './config/posthog.js';
import { startMatchesScheduler } from './utils/fetchScheduler.js';
import { startCalculationScheduler } from './utils/calculationScheduler.js';

const port = process.env.PORT || 5000;

const shutdown = async () => {
  await posthog.shutdown(1500).catch(err => console.error('PostHog shutdown error: ', err))
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

startMatchesScheduler()
startCalculationScheduler()