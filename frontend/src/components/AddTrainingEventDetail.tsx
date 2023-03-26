import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';
import '../css/AddTrainingEventDetail.css';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

interface Training {
  item: any,
  bodyValue: any
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const currencies = [
  { value: '胸', label: '胸' },
  { value: '背中', label: '背中' },
  { value: '肩', label: '肩' },
  { value: '腕', label: '腕' },
  { value: '腹', label: '腹' },
  { value: '足', label: '足' },
  { value: '有酸素', label: '有酸素' },
];

const registerData = (state: any, memo: string) => {
  const sendData = {
    logItems: state,
    memo: memo,
  }

  try {
    fetch(`/api/registerTrainingEvent`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
    .then(() => {
      alert('登録しました');
      App();
    })
  }
  catch (e) {
    console.error(e);
  }
  console.log(state);
}

const DispEventListDetail = (props: Obj) => {
  const navigate = useNavigate();
  let setStateVal = {
    'trainingEventsCode': props.data.trainingEvents_code,
    'trainingEventsName': props.data.trainingEvents_name,
    'bodyCode': props.data.body_code,
  };

  return (
    <>
      <ListItemButton
        onClick={() => navigate('/training/register',
        {state: setStateVal})}
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

const AddTrainingList = (props: any) => {
  const [bodyParts, setBodyParts] = useState(props.name);
  const [trainingLogsMemo, setTrainingLogsMemo] = useState('');
  return (
    <>
      <div className="center">
        <h3>種目追加</h3>
      </div>
      <div className="outer">
        <TextField
          id="standard-select-currency"
          className="selectBodyPartsArea"
          select
          defaultValue={props.name}
          label="部位"
          variant="standard"
          onChange={(e) => setBodyParts(e.target.value)}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="outer">
        <TextField
          id="standard-basic"
          className="inputTrainingEventArea"
          label="種目名"
          variant="standard"
          // fullWidth
          onChange={(event) => { setTrainingLogsMemo(event.target.value) }
        }
        />
      </div>
      <div className="outer trainingEventRegisterButton">
        <Button
          variant="contained"
          onClick={() =>
            registerData(props.name, trainingLogsMemo)}>登録
        </Button>
      </div>
    </>
  );
}

const App = () => {
  // クエリパラメータから部位判定する。
  const location = useLocation();
  const queryParam = location.pathname.split('/').slice(-1)[0];

  const [trainingEventData, setTrainingEventData] = useState<Obj>([]);
  const [bodyPartsName, setBodyPartsName] = useState<string>();
  const URL = `/api/getTrainingEventItems?code=${queryParam}`;

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTrainingEvents(newValue);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(result => {
          setTrainingEventData(result.trainingEventData);
          setBodyPartsName(result.bodyPartsName[0].bodyParts_name);
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
      <div className="dispEventListArea">
        <DispEventList
          item={trainingEventData}
          key={trainingEventData.trainingEvents_code}
        />
      </div>
      <AddTrainingList
        name={bodyPartsName}
      />
    </>
  );
};

export default App;