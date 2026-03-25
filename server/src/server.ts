import 'dotenv/config';
import app from './index.js';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});