import { dbSetting } from './mysqlConfig'
import dayjs from 'dayjs';
import * as big from './bigjs'

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}
// const rowItem: Obj = {// 初期化するときにそのObjという型で宣言してあげることで、どんなプロパティでも持てる型になる
// }
interface calcRMDatas {
  weight: number
  count: number
}

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
        ON log.bodyParts_code = body.bodyParts_code
      where execute_date like ?;`
    let param = [targetDate];

    const rows = await connection.execute(query, param);

    let rowItems: any = rows[0];
    rowItems.forEach((rowItem: Obj) => {
      const culcResult = cultMultipleTotalVal(rowItem);
      rowItem.totalWeight = culcResult.totalWeight;
      rowItem.totalSetCount = culcResult.totalSetCount;
      rowItem.repetitionMaximum = culcResult.repetitionMaximum;
    });

    return rowItems;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

interface queryParam {
  date: Date,
  bodyCode: string,
  eventCode: string,
}

/**
 * 種目ごとのトレーニング履歴を取得（日付単位）
 */
export async function getTrainingLogDetail (queryParam: queryParam) {
  try {
    // DB接続
    const connection = await dbSetting();

    const searchDate = dayjs(new Date(queryParam.date)).format('YYYY-MM-DD HH:mm:ss');
    const query = `
      SELECT log.*, event.*, body.*
      FROM trainingLogs AS log
      LEFT JOIN trainingEvents AS event
        ON log.event_code = event.trainingEvents_code
      LEFT JOIN bodyParts AS body
        ON log.bodyParts_code = body.bodyParts_code
      where log.execute_date like ?
        AND log.bodyParts_code = ?
        AND log.event_code = ?;`
    const param = [searchDate, Number(queryParam.bodyCode), Number(queryParam.eventCode)];
    const rows = await connection.execute(query, param);
    const rowItem: any = rows[0];

    // 上記クエリよりrowItemは1データしかない前提でボリュームと1RMを計算しクライアントに返す
    let editRowItem: Obj =  rowItem[0];
    // 返り値の合計セット数は使用しない想定
    const culcResult = cultMultipleTotalVal(editRowItem);
    editRowItem.totalWeight = culcResult.totalWeight;
    editRowItem.repetitionMaximum = culcResult.repetitionMaximum;

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * すべてのトレーニング種目を取得
 */
export async function getAllEventItems () {
  try {
    // DB接続
    const connection = await dbSetting();
    const query = 'SELECT * FROM trainingEvents ORDER BY body_code';

    const rows = await connection.execute(query);
    const rowItem: any = rows[0];

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * すべてのトレーニング方法名を取得
 */
export async function getAllMethodsItems () {
  try {
    // DB接続
    const connection = await dbSetting();
    const query = 'SELECT * FROM trainingMethods ORDER BY methodCode';

    const rows = await connection.execute(query);
    const rowItem: any = rows[0];

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * codeが一致するトレーニング種目を取得
 */
export async function getTrainingEventItems (code: string) {
  try {
    // DB接続
    const connection = await dbSetting();
    const query = `
      SELECT *
      FROM trainingEvents
      WHERE body_code = ${code}
      ORDER BY body_code`;

    const rows = await connection.execute(query);
    const rowItem: any = rows[0];

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * すべてのトレーニング種目部位を取得
 */
export async function getAllBodyParts () {
  try {
    // DB接続
    const connection = await dbSetting();
    const query = 'SELECT * FROM bodyParts ORDER BY bodyParts_code';

    const rows = await connection.execute(query);
    const rowItem: any = rows[0];

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * codeが一致するトレーニング種目を取得
 */
export async function getBodyPartsItems (code: string) {
  try {
    // DB接続
    const connection = await dbSetting();
    const query = `
      SELECT *
      FROM bodyParts
      WHERE bodyParts_code = ${code}`;

    const rows = await connection.execute(query);
    const rowItem: any = rows[0];

    return rowItem;
  }
  catch (err: any) {
    throw new Error(err)
  }
}

/**
 * トレーニング履歴登録処理
 * @param sendData
 */
export async function registerTrainingLogs (sendData: Obj) {
  // DB接続
  const connection = await dbSetting();

  // 日付取得(datetime型)
  const registDate = dayjs(new Date(sendData.trainingDate)).format('YYYY-MM-DD HH:mm:ss');

  // 送信データの整形
  const shapingData = makeRegistData(registDate, sendData);

  // テーブルのカラム名を取得
  const getColumnNameQuery = 'DESCRIBE trainingLogs';
  const getColumnName = await connection.execute(getColumnNameQuery);
  const ColumnName: any = getColumnName[0];

  // INSERT INTO以降のクエリ部分を作成
  const columns = ColumnName
  .reduce((acc: string, cur: Obj) => {
    return acc + cur.Field + ','
  }, '(')
  .slice(0, -1)
  .concat(')');

  // テーブルのカラム数を取得
  const getColumnQuery = 'select count(*) as count from information_schema.columns where table_name = "trainingLogs"';
  const getColumn = await connection.execute(getColumnQuery);
  const getCount: any = getColumn[0];
  const loopCount = getCount[0].count;

  // VALUES以降のクエリ部分を作成
  const questions = `(${'?,'.repeat(loopCount).slice(0, -1)})`;

  // データ更新クエリ
  const query = `insert into trainingLogs ${columns} VALUES ${questions}`;

  // データ更新
  await connection.execute(query, shapingData);
}

/**
 * トレーニング履歴削除処理
 * @param sendData
 */
export async function deleteTrainingLogs (sendData: Obj) {
  // DB接続
  const connection = await dbSetting();

  // 日付取得(datetime型)
  const targetDate = dayjs(new Date(sendData.date)).format('YYYY-MM-DD HH:mm:ss');

  // データ削除クエリ
  const query = `
    DELETE FROM trainingLogs
    WHERE execute_date = "${targetDate}"
      AND bodyParts_code = "${sendData.bodyCode}"
      AND event_code = "${sendData.eventCode}"
    LIMIT 1`;

  // クエリ実行
  await connection.execute(query);
}

/**
 * トレーニング種目登録処理
 * @param sendData
 */
export async function registerTrainingEvent (sendData: Obj) {
  // DB接続
  const connection = await dbSetting();

  // テーブルのカラム名を取得
  const getColumnNameQuery = 'DESCRIBE trainingEvents';
  const getColumnName = await connection.execute(getColumnNameQuery);
  const ColumnName: any = getColumnName[0];

  ColumnName.shift() // code列は1列目に存在し、AIを設定しているので除外する

  // INSERT INTO以降のクエリ部分を作成
  const columns = ColumnName
  .reduce((acc: string, cur: Obj) => {
    return acc + cur.Field + ','
  }, '(')
  .slice(0, -1)
  .concat(')');

  // テーブルのカラム数を取得
  const getColumnQuery = 'select count(*) as count from information_schema.columns where table_name = "trainingEvents"';
  const getColumn = await connection.execute(getColumnQuery);
  const getCount: any = getColumn[0];
  const loopCount = getCount[0].count -1; // code列はAIを設定しているので総カラム数から除外する

  // VALUES以降のクエリ部分を作成
  const questions = `(${'?,'.repeat(loopCount).slice(0, -1)})`;

  // 種目コードを生成
  let getEventDataQuery = `
  SELECT count(*) as "総数"
  FROM trainingEvents`;
  const rows = await connection.execute(getEventDataQuery);
  let result: any = rows[0];
  let trainingEvents_code = result[0].総数 + 1;

  // 登録データ作成
  const registerData = [sendData.bodyPartsCode, trainingEvents_code, sendData.trainingEventName];

  // データ更新クエリ
  const query = `insert into trainingEvents ${columns} VALUES ${questions}`;
  // データ更新
  await connection.execute(query, registerData);
}

/**
 * 合計重量、合計セット数、推定1RMの計算
 * @param editRowItem
 */
function cultMultipleTotalVal(editRowItem: Obj) {
  let totalSetCount = 0;
  let totalWeight = 0;
  let totalVolume = 0;
  let maxWeightAndCount: calcRMDatas = { weight: 0, count: 0};

  for (const[key, value] of Object.entries(editRowItem)) {
    if (key.match(/^weight/)) {
      totalSetCount = value !== 0 ? totalSetCount + 1 : totalSetCount;

      let arrKey = key.split('_');
      let targetNum = arrKey[1];
      let targetPlaycount = `playcount_${targetNum}`;
      totalVolume = value * editRowItem[targetPlaycount];
      totalWeight += totalVolume;

      if (value > maxWeightAndCount.weight) {
        maxWeightAndCount.weight = value;
        maxWeightAndCount.count = editRowItem[targetPlaycount];
      }
    }
  }

  editRowItem.totalWeight = totalWeight;
  editRowItem.totalSetCount = totalSetCount;

  const repetitionMaximum = calcRepetitionMaximum(maxWeightAndCount, editRowItem.trainingEvents_name);
  editRowItem.repetitionMaximum = repetitionMaximum;

  return {
    totalWeight: editRowItem.totalWeight,
    totalSetCount: editRowItem.totalSetCount,
    repetitionMaximum: editRowItem.repetitionMaximum,
  }
}

/**
 * 種目ごとの推定1RM計算
 * @param calcRMDatas 対象種目の最大重量とレップ数
 * @param eventName トレーニング種目名
 * @description BIG3のみこのサイト(https://fwj.jp/magazine/rm/)を参考に計算。
 * その他種目に関しては一般的な理論式から計算する。
 * 詳細に出したい種目があれば分岐を追加していけばよい。
 */
function calcRepetitionMaximum (calcRMDatas: calcRMDatas, eventName: string) {
  let result: number = 0;
  const maxWeight = calcRMDatas.weight;
  const maxCount = calcRMDatas.count;
  switch (eventName) {
    case 'ベンチプレス':
      result = big.add(big.div(big.times(maxWeight, maxCount), 40), maxWeight);
      break;
    case 'スクワット':
    case 'デッドリフト':
      result = big.add(big.div(big.times(maxWeight, maxCount), 33.3), maxWeight);
      break;
    default: //　オコナ―式
      result = big.times(maxWeight, (big.add(1, big.div(maxCount, 40))));
      break;
  }
  result = big.trunc(result, 3);
  return result;
}

/**
 * クライアントから送信されたデータを登録用に整形する
 * @param date
 * @param sendData
 * @description いったんべた書きとする。柔軟性を求める方法としてDBのカラム名と
 * 送られてくるオブジェクトのkeyを等しくすることで対応出来る。将来的な課題としておく。
 */
function makeRegistData (date: any, sendData: any) {
  let result = [];

  // 日付の追加
  result.push(date);

  // bodycode、eventCodeの順に追加
  result.push(sendData.bodyCode, sendData.eventCode);

  // bodycode追加
  const logItems = sendData.logItems;
  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < logItems.length; j++) {
      result.push(logItems[j][i]);
    }
  }

  // memoの追加
  result.push(sendData.memo);

  return result;
}