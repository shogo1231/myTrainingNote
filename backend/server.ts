import express from 'express';
import {GetStaffData} from './userData';

const app: express.Express = express();
const port = 8000;

app.get('/api/getUser', async (req: express.Request, res: express.Response) => {
  const getUserData = await GetStaffData();
  res.status(200).send(getUserData);
});

app.listen(port, () => {
  console.log(`port ${port} でサーバ起動中`);
});