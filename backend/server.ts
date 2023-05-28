import express from 'express';
import {GetStaffData} from './userData';
import * as training from './training';

const app: express.Express = express();
const port = 8001;

// body-parser settings これがないとクライアントからpostされたデータを読み込めない
app.use(express.json());

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

app.get('/api/getAllEventItems', async (req: express.Request, res: express.Response) => {
  const getAllEventItems = await training.getAllEventItems();
  const getAllMethodsItems = await training.getAllMethodsItems();
  res.status(200).send({event: getAllEventItems, method: getAllMethodsItems});
});

app.get('/api/getAllBodyParts', async (req: express.Request, res: express.Response) => {
  const getAllBodyParts = await training.getAllBodyParts();
  res.status(200).send(getAllBodyParts);
});

app.get('/api/getTrainingEventItems', async (req: express.Request, res: express.Response) => {
  const eventCode: any = req.query.code;
  const getTrainingEventItems = await training.getTrainingEventItems(eventCode);
  const getBodyPartsName = await training.getBodyPartsItems(eventCode);
  res.status(200).send({trainingEventData: getTrainingEventItems, bodyPartsName: getBodyPartsName});
});

app.post('/api/registerTrainingLog', async (req: express.Request, res: express.Response) => {
  try {
    const sendData = req.body;
    await training.registerTrainingLogs(sendData);
    res.status(200).send('ok');
  }
  catch (err: any) {
    throw new Error(err)
  }
});

app.post('/api/registerTrainingEvent', async (req: express.Request, res: express.Response) => {
  try {
    const sendData = req.body;
    await training.registerTrainingEvent(sendData);
    res.status(200).send('ok');
  }
  catch (err: any) {
    throw new Error(err)
  }
});

// トレーニング履歴の削除
app.delete('/api/deleteTrainingLog', async (req: express.Request, res: express.Response) => {
  try {
    const sendData = req.body;
    await training.deleteTrainingLogs(sendData);
    res.status(200).send('ok');
  }
  catch (err: any) {
    throw new Error(err)
  }
});

app.listen(port, () => {
  console.log(`port ${port} でサーバ起動中`);
});