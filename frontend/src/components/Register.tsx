import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../css/TrainingLog.css';
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

// dayjsの言語設定。グローバルで適用する。
// メモ：モジュール化して各ページでべた書きしないようにする
dayjs.locale(ja);

const TrainingDetail = (props: Obj) => {
  const trainingDate = dayjs(new Date()).format('YYYY/MM/DD');
  const dayOfWeek = dayjs(trainingDate).format('dddd');
  let setCount: any = ['セット'];
  let weight: any = ['重量'];
  let count: any = ['回数'];
  let rest: any = ['レスト'];

  // セット、重量、回数、レストの４単位 １～１０までで１レコードとなるようにデータを成形する
  // 将来的には一時保存復元に対応できるよう調整の必要あり
  for (let i = 1; i <= 10; i++) {
    setCount.push(i);
    weight.push(0);
    count.push(0);
    rest.push(0);
  }

  const trainingLogs = [
    {...setCount},
    {...weight},
    {...count},
    {...rest},
  ];

  return (
    <>
      <div className="trainingLogHeader">
        <div className="trainingDate">{trainingDate} {dayOfWeek}</div>
        <div className="trainingEventName">{props.dataItem.eventName}</div>
      </div>
      {/* tebleのwidthがデフォルト状態で画面幅に応じて余分な余白ができているので今後改修予定する */}
      <TableContainer component={Paper}>
        <Table id="test" sx={{ minWidth: 950 }}>
          {trainingLogs.map((logObject, baseIndex) => (
          <>
            <TableBody className="table-Border" sx={{ width: 300 }}>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              {Object.values(logObject).map((logVal: any, index: number) => (
                <TableCell
                  className = {
                    index !== 0
                    // 登録画面ではデフォルトのpadding:16pxが不要なのでCSS分岐して消しこむ
                    ? (logVal !== 0 ? "tableCell-basic" : "tableCell-basic tableCell-input")
                    : 'tableCell-sideHeader'
                  }
                >
                  {logVal !== 0
                    ? logVal
                    : <TextField
                        id="outlined-helperText"
                        label= {baseIndex === 1 ? "kg" : baseIndex === 2 ? "回" : "秒" }
                      />
                  }
                </TableCell>
              ))}
              </TableRow>
            </TableBody>
          </>
          ))}
        </Table>
      </TableContainer>
      <div className="trainingLogMemo">
        <TextField id="standard-basic" label="メモ" variant="standard" fullWidth/>
      </div>
    </>
  )
}

const App = () => {
  // let test: HTMLTableElement = document.getElementById('test') as HTMLTableElement;

  // if (test !== null) {
  //   // rowsやcellsはArrayLikeですがIterableではないのでArray.formで配列にするとfor ofを使えます。
  //   for (let row of Array.from(test.rows)) {
  //     for (let cell of Array.from(row.cells)) {
  //       // console.log(cell);
  //         // cell.textContent = 'test';
  //     }
  //   }
  // }
  const location = useLocation();
  const queryParam = {
    bodyCode: location.state.bodyCode,
    eventCode: location.state.eventCode,
    eventName: location.state.eventName
  }

  return (
    <>
      <Header />
      <div className="container">
        <TrainingDetail dataItem={queryParam}/>
      </div>
    </>
  );
};

export default App;