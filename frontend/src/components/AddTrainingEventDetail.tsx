import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';
import '../css/AddTrainingEventDetail.css';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

const DispEventListDetail = (props: Obj) => {
  // 既存の種目の修正はここで遷移先設定、修正アイコンを追加する予定。
  const navigate = useNavigate();
  let setStateVal = {
    'trainingEventsCode': props.data.trainingEvents_code,
    'trainingEventsName': props.data.trainingEvents_name,
    'bodyCode': props.data.body_code,
  };

  return (
    <>
      <ListItemButton
        // onClick={() => navigate('/training/register',
        // {state: setStateVal})}
      >
        <ListItemText primary={props.data.trainingEvents_name} />
      </ListItemButton>
      <Divider />
    </>
  );
}

const DispEventList = (props: any) => {
  let trainingEventDatas = props.item;
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
    {trainingEventDatas.map((trainingEventData: any, index: number) => {
      return <DispEventListDetail data={trainingEventData} key={trainingEventData.trainingEvents_code}/>
    })}
    </List>
  );
}

const App = () => {
  // クエリパラメータから部位判定する。
  const location = useLocation();
  const queryParam = location.pathname.split('/').slice(-1)[0];
  const [trainingEventData, setTrainingEventData] = useState<Obj>([]);
  const [bodyPartsName, setBodyPartsName] = useState<string>();
  const [bodyPartsCode, setBodyPartsCode] = useState<string>();
  const URL = `/api/getTrainingEventItems?code=${queryParam}`;
  const transitionURL = `/training/editEvent?code=${bodyPartsCode}&name=${bodyPartsName}`;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(result => {
          setTrainingEventData(result.trainingEventData);
          setBodyPartsName(result.bodyPartsName[0].bodyParts_name);
          setBodyPartsCode(result.bodyPartsName[0].bodyParts_code);
        })
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [URL]);

  return (
    <>
      <Header />
      <div className="center bodyPartsListTitle">
        <h3>{bodyPartsName}の種目一覧</h3>
      </div>
      {trainingEventData &&
        <div className="dispEventListArea">
          <DispEventList
            item={trainingEventData}
            key={trainingEventData.trainingEvents_code}
          />
        </div>
      }
      <div className="outer trainingEventRegisterButton">
        <Button
           variant="contained"
           onClick={() =>
            navigate(transitionURL)
          }
         >種目追加
        </Button>
      </div>
    </>
  );
};

export default App;