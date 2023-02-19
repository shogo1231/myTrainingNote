import { dbSetting } from './mysqlConfig'
import dayjs from 'dayjs';
import * as big from './bigjs'

interface calcRMDatas {
  weight: number
  count: number
}

/**
 * 対象日付のトレーニング履歴を取得
 */
export async function getTrainingLogData (_targetDate:any) {
  interface Obj {
    [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
    [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  }
  // const rowItem: Obj = {// 初期化するときにそのObjという型で宣言してあげることで、どんなプロパティでも持てる型になる
  // }

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

    const rows = await connection.execute(query, param);

    let rowItems: any = rows[0];
    rowItems.forEach((rowItem: Obj) => {
      let totalSetCount = 0;
      let totalWeight = 0;
      let totalVolume = 0;
      let maxWeightAndCount: calcRMDatas = { weight: 0, count: 0};

      for (const [key, value] of Object.entries(rowItem)) {
        if (key.match(/^weight/)) {
          totalSetCount = value !== 0 ? totalSetCount + 1 : totalSetCount;

          let arrKey = key.split('_');
          let targetNum = arrKey[1];
          let targetPlaycount = `playcount_${targetNum}`;
          totalVolume = value * rowItem[targetPlaycount];
          totalWeight += totalVolume;

          if (value > maxWeightAndCount.weight) {
            maxWeightAndCount.weight = value;
            maxWeightAndCount.count = rowItem[targetPlaycount];
          }
        }
      }
      rowItem.totalWeight = totalWeight;
      rowItem.totalSetCount = totalSetCount;

      const repetitionMaximum = calcRepetitionMaximum(maxWeightAndCount, rowItem.trainingEvents_name);
      rowItem.repetitionMaximum = repetitionMaximum;
    });

    return rowItems;
  }
  catch (err: any) {
    throw new Error(err)
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