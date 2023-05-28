import * as decimals from './bigjs'

/**
 * アセンディングセット法でのトレーニングメニュー計算
 * @param weight 1RMの最大重量
 */
function assendingSet (weight: number) {
  // ５セット計算するのでセット数ごとに％を変えて計算し、結果を格納していく。
  let parcent = [0.5, 0.6, 0.7, 0.8, 0.85];
  let leps = [12, 10, 8, 6, 4];
  let lest = [120, 150, 180, 180, 180 ]; // 秒換算
  let result = culcSettingData(weight, parcent, leps, lest);
  return result;
}

/**
 * ディセンディングセット法でのトレーニングメニュー計算
 * @param weight 1RMの最大重量
 */
function dissendingSet (weight: number) {
  // ５セット計算するのでセット数ごとに％を変えて計算し、結果を格納していく。
  // レップ数は固定としているが、将来的には入力値で可変としたい。(強度でレップ数が変わる等の手法が存在する)
  // 入力値は1RMの最大重量。0.8をかけることでほぼ10RMになるので先に計算する。
  let trgtWeight = decimals.multipy(weight, 0.8);
  let parcent = [1, 1, 1, 0.7, 0.7];
  let leps = [10, 8, 6, 5, 5];
  let lest = [240, 240, 180, 0, 0 ]; // 秒換算
  let result = culcSettingData(trgtWeight, parcent, leps, lest);
  return result;
}

/**
 * ピラミッドセット法でのトレーニングメニュー計算
 * 多関節種目に対応した計算ロジックとなる
 * @param weight 1RMの最大重量
 */
function pyramidSet (weight: number) {
  // ６セット計算するのでセット数ごとに％を変えて計算し、結果を格納していく。
  // ５、６セット目は限界までなので一旦９９でセット。限界を示す文字表示を対応させたい
  let parcent = [0.6, 0.7, 0.8, 0.9, 0.7, 0.6];
  let leps = [8, 6, 4, 2, 99, 99];
  let lest = [180, 180, 180, 60, 60, 60]; // 秒換算
  let result = culcSettingData(weight, parcent, leps, lest);
  return result;
}

// 後日実装予定。
// 強度の高いピラミッドセット法
// 1セット目：60％×8〜10レップ
// 2セット目：70％×6レップ
// 3セット目：80％×4レップ
// 4セット目：90％×2レップ
// 5セット目：100％×1
// 6セット目：5セット目以下×限界まで
// 7セット目：6セット目以下×限界まで
// 8セット目：7セット目以下×限界まで

/**
 * ドロップセット法でのトレーニングメニュー計算
 * @param weight 1RMの最大重量
 */
function dropSet (weight: number) {
  // ６セット計算するのでセット数ごとに％を変えて計算し、結果を格納していく。
  // セットは限界までなので一旦９９でセット。限界を示す文字表示を対応させたい
  let parcent = [1, 0.8, 0.8, 0.8];
  let leps = [10, 99, 99, 99];
  let lest = [0, 0, 0, 0]; // 秒換算
  let result = [];
  let setWeight = weight;
  for (let i = 0; i < leps.length; i++) {
    let culcWeight = decimals.multipy(setWeight, parcent[i]);
    let settingData = {
      回数: i + 1,
      重量: culcWeight,
      レップ数: leps[i],
      レスト: lest[i]
    }
    result.push(settingData);
    setWeight = culcWeight;
  }
  return result;
}

/**
 * フォースドレップ法でのトレーニングメニュー計算
 * 多関節種目に対応した計算ロジックとなる
 * @param weight 1RMの最大重量
 */
function forcedLep (weight: number) {
  // 3セット計算する。セット数ごとに％は変わらないが共通の計算処理ロジックを利用して結果を格納していく。
  let parcent = [0.6, 0.7, 0.8, 0.9, 0.7, 0.6];
  let leps = [8, 6, 4, 2, 99, 99];
  let lest = [180, 180, 180, 60, 60, 60]; // 秒換算
  let result = culcSettingData(weight, parcent, leps, lest);
  return result;
}

/**
 * レストポーズ法でのトレーニングメニュー計算
 * 入力値は1RMとしているのでここで85%に設定してから計算する
 * @param weight 1RMの最大重量
 */
function restPause (weight: number) {
  // 3セット計算する。セット数ごとに％は変わらないが共通の計算処理ロジックを利用して結果を格納していく。
  let parcent = [0.85, 0.85, 0.85];
  let leps = [6, 3, 3];
  let lest = [30, 30, 30]; // 秒換算
  let result = culcSettingData(weight, parcent, leps, lest);
  return result;
}

interface Item {
  回数: number | string;
  重量: number | string;
  レップ数: number | string;
  レスト: number | string;
}
/**
 * 各メニューの設定データ計算処理
 */
function culcSettingData (weight, parcent, leps, lest) {
  // 画面表示の都合上、表の1行目はヘッダ行となるので項目名をセット
  let result: Item[] = [{回数: 'セット数', 重量: '重量(kg)', レップ数: 'レップ数(回)', レスト: '休憩(秒)'}];
  for (let i = 0; i < leps.length; i++) {
    let culcWeight = decimals.multipy(weight, parcent[i]);
    let settingData = {
      回数: i + 1,
      重量: culcWeight,
      レップ数: leps[i],
      レスト: lest[i]
    }
    result.push(settingData);
  }
  return result;
}

export {
  assendingSet,
  dissendingSet,
  pyramidSet,
  dropSet,
  forcedLep,
  restPause,
}