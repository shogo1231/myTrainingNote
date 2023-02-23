import express from 'express';
import {GetStaffData} from './userData';
import * as training from './training';

const app: express.Express = express();
const port = 8001;

app.get('/api/getUser', async (req: express.Request, res: express.Response) => {
  const getUserData = await GetStaffData();
  res.status(200).send(getUserData);
});

app.get('/api/getTrainingLog', async (req: express.Request, res: express.Response) => {
  const targetDate = req.query.date;
  const getTrainingLogData = await training.getTrainingLogData(targetDate);
  res.status(200).send(getTrainingLogData);
});

app.get('/api/getTrainingLogDetail', async (req: express.Request, res: express.Response) => {
  const queryParams: any = req.query;
  const getTrainingLogDetailData = await training.getTrainingLogDetail(queryParams);
  res.status(200).send(getTrainingLogDetailData);
});

app.listen(port, () => {
  console.log(`port ${port} でサーバ起動中`);
});