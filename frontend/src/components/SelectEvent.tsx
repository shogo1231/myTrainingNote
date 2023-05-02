import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

interface Training {
  item: any,
  bodyValue: any
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const SelectEvents = (props: Training) => {
  return (
    <>
      <Box className="selectEventsArea" sx={{ bgcolor: 'paper' }}>
        <Tabs
          value={props.bodyValue}
          onChange={props.onChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          <Tab label="よくやる種目" />
          <Tab label="胸" />
          <Tab label="背中" />
          <Tab label="肩" />
          <Tab label="腕" />
          <Tab label="腹" />
          <Tab label="足" />
          <Tab label="有酸素運動" />
        </Tabs>
      </Box>
    </>
  )
}

const DispEventListDetail = (props: Obj) => {
  const navigate = useNavigate();
  let setStateVal = {
    'bodyCode': props.data.body_code,
    'eventCode': props.data.trainingEvents_code,
    'eventName': props.data.trainingEvents_name,
  };

  return (
    <>
      <ListItemButton onClick={() => navigate('/training/register', {state: setStateVal})}>
        <ListItemText primary={props.data.trainingEvents_name} />
      </ListItemButton>
      <Divider />
    </>
  );
}

// 部位単位での全データを表示するコンポーネント
const DispEventList = (props: any) => {
  let trainingEventLists = props.item.filter((eventItem: Obj) => {
    return eventItem.body_code === props.bodyValue;
  });
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
    {trainingEventLists.map((trainingData: any, index: number) => {
      return <DispEventListDetail data={trainingData} key={trainingData.trainingEvents_code}/>
    })}
    </List>
  );
}

const DispMethodListDetail = (props: Obj) => {
  const navigate = useNavigate();
  let setStateVal = {
    'methodCode': props.data.methodCode,
    'methodName ': props.data.methodName,
  };

  return (
    <>
      <ListItemButton onClick={() => navigate('/training/menuSetting', {state: setStateVal})}>
        <ListItemText primary={props.data.methodName} />
      </ListItemButton>
      <Divider />
    </>
  );
}

// 全てのトレーニング方法データを表示するコンポーネント
const DispEventListMethod = (props: any) => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
    {props.item.map((methodData: any, index: number) => {
      return <DispMethodListDetail data={methodData} key={methodData.methodCode}/>
    })}
    </List>
  );
}

const App = () => {
  const [trainingDetailData, setTrainingDetailData] = useState<Obj>([]);
  const [trainingMethodData, setTrainingMethodData] = useState<Obj>([]);
  const URL = `/api/getAllEventItems`;

  const [selectBodyValue, setBodyValue] = useState(1); // デフォルトは「胸」としておく
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setBodyValue(newValue);
  };

  // 部位・計画どちらの表示を適用するかの判定用
  const [dispPlanFlg, setDispPlanFlg] = useState('部位'); // デフォルトは「部位」としておく

  const navigate = useNavigate();

  // サーバより種目データの取得とstateへのセット
  // 部位・計画の切り替えで表示データが違うのでここでまとめてデータ取得しパフォーマンスを抑えたい
  // いったんURIはそのまま
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(result => {
          setTrainingDetailData(result.event);
          setTrainingMethodData(result.method);
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
      { dispPlanFlg === '部位' &&
      <>
        <SelectEvents
          item={trainingDetailData}
          bodyValue={selectBodyValue}
          onChange={handleChange}
        />
        <div className="dispEventListArea">
          <DispEventList
            item={trainingDetailData}
            bodyValue={selectBodyValue}
            key={trainingDetailData.event_code}
          />
        </div>
      </>
      }
      { dispPlanFlg === '計画' &&
      <>
        {/* セット名を登録しているデータのリスト表示。種目名とはやることが違うのでコンポーネントはいったん分けておく */}
        <div className="dispEventListArea">
          <DispEventListMethod
            item={trainingMethodData}
            key={trainingMethodData.methodCode}
          />
        </div>
        </>
      }

      <div className='selectPlanArea'>
        <div>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            text-arign= "light"
            sx={{ mr: 2 }}
            style={{ margin: 0 }}
            onClick={() => setDispPlanFlg('部位')}
          >
            <AccessibilityNewIcon/>
          </IconButton>
          <div>部位から選択</div>
        </div>
        <div>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            text-arign= "light"
            sx={{ mr: 2 }}
            style={{ margin: 0 }}
            onClick={() => setDispPlanFlg('計画')}
          >
            <AssignmentIcon/>
          </IconButton>
          <div>計画から選択</div>
        </div>
      </div>
    </>
  );
};

export default App;