import { dbSetting } from './mysqlConfig'
import dayjs from 'dayjs';

/**
 * 対象日付のトレーニング履歴を取得
 */
export async function getTrainingLogData (_targetDate:any) {
  try {
    // DB接続
    const connection = await dbSetting();

    // 前方一致させたいので末尾にワイルドカードを追加する
    const targetDate = dayjs(_targetDate).format('YYYY-MM-DD') + '%';
    const query = `
      SELECT log.*, event.*, body.*
      FROM trainingLogs AS log
      LEFT JOIN trainingEvents AS event
      ON log.event_code = event.trainingEvents_code
      LEFT JOIN bodyParts AS body
      ON log.body_code = body.bodyParts_code
      where execute_date like ?;`
    let param = [targetDate];

    const [rows, fields] = await connection.execute(query, param);
    return rows;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

