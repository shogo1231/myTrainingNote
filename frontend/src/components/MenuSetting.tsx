import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';
import '../css/MenuSetting.css'; 
import * as culc from '../modules/culcTrainingMenu'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const createTrainingMenu = (methodCode: string, methodName: string, trWeight: number) => {
  let result;
  // 種目は不要かもしれない。種目によって計算ロジックが変わりそうなら必要程度。
  
  switch (methodName) {
    case 'アセンディングセット法':
      result = culc.assendingSet(trWeight);
      break;
    case 'ディセンディングセット法':
      result = culc.dissendingSet(trWeight);
      break;
    case 'ピラミッドセット法':
      result = culc.pyramidSet(trWeight);
      break;
    case 'ドロップセット法':
      result = culc.dropSet(trWeight);
      break;
    case 'フォースドレップ法':
      result = culc.forcedLep(trWeight);
      break;
    case 'レストポーズ法':
      result = culc.restPause(trWeight);
      break; 
    default:
      break;
  }

  return result;
}

/**
 * 各メニュー内容をテーブルで表示
 * テーブルは種目ごとのログ表示画面でのレイアウトをそのまま引用する
 * @param props 
 * @param key 
 * @returns 
 */
const DispTrMenuDatas = (props: any, key: any) => {
  return (
    <>
      {/* tebleのwidthがデフォルト状態で画面幅に応じて余分な余白ができているので今後改修予定する */}
      <TableContainer component={Paper}>
        <Table id="test" sx={{ minWidth: 400 }}>
          {props.menuData.map((logObject) => (
          <>
            <TableBody className="table-Border" sx={{ width: 300 }}>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              {Object.values(logObject).map((logVal: any, index: number) => (
                <TableCell className = "tableCell-basic" >
                  {logVal}
                </TableCell>
              ))}
              </TableRow>
            </TableBody>
          </>
          ))}
        </Table>
      </TableContainer>
    </>
  );
}

interface trMenuDataobject {
  回数: number,
  重量: number,
  レップ数: number,
  レスト: number,
}

const App = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  // 2個目以降のkeyに半角スペースが混入し正しく参照できない現象が起きてた。JSONで取得しているのでparseしておく
  const getState = JSON.parse(location.state); 
  let methodCode = getState.methodCode;
  let methodName = getState.methodName;
  const [trWeight, settrWeight ] = useState<number>();
  const [trMenuDatas, setTrMenuDatas ] = useState<Array<trMenuDataobject>>([]);

  // 一旦BIG3のみ、後日API取得した部位名、種目名がセットされる想定
  const trDatas = [
    { label: 'スクワット', data: 'スクワット' },
    { label: 'ベンチプレス', data: 'ベンチプレス' },
    { label: 'デッドリフト', data: 'デッドリフト' },
  ]

  return (
    <>
      <Header />
      <div className="center">
        <div className=".editEventTitleTitle">
          <h3>トレーニングメニュー設定</h3>
          <div>{methodName}</div>
        </div>
        <div className="selectAutocompleteArea">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={trDatas}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="種目名" />}
          />
        </div>
        <div className="editEventTextArea">
          <TextField
            id="standard-basic"
            label="重量"
            variant="standard"
            type="number"
            sx={{ width: '250px' }}
            onChange={(event)=> {
              settrWeight(Number(event.target.value));
            }}
          />
        </div>
      </div>
      <div className="outer trainingEventRegisterButton">
        <Button
          variant="contained"
          onClick={() => {
            let result = createTrainingMenu(methodCode, methodName, trWeight);
            setTrMenuDatas(result);
          }}
        >表示
        </Button>
      </div>
      {/* 空っぽで反映クリックでエラーになるが動作はする、入力後空欄にして再度クリックで０表示になるので対策したい */}
      { (trMenuDatas && trMenuDatas.length !== 0) &&
        <>
          <div className="container">
          <DispTrMenuDatas
            menuData = {trMenuDatas}
          />
          </div>
          <div className="outer trainingEventRegisterButton">
            <Button
              variant="contained"
              onClick={() => {
              }}
            >登録画面に反映
            </Button>
          </div>
        </>
      }
    </>
  );
};

export default App;