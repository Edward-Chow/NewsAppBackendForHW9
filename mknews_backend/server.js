import express from 'express';
import cors from 'cors';
import weatherRoute from './routes/weather';
import guardianRoute from './routes/guardian';
import trendingRoute from './routes/trending';

const app = express();
const PORT = 4000;
const router = express.Router();

router.use('/guardian', guardianRoute());
router.use('/weather', weatherRoute());
router.use('/trending', trendingRoute());

app.use(cors());
app.use('/newsapi/v2.0', router);

app.listen(PORT);
