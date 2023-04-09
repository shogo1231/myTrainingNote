import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

interface Training {
  item: any,
  bodyValue: any
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const DispEventListDetail = (props: Obj) => {
  const navigate = useNavigate();
  return (
    <>
      <ListItemButton
        onClick={() => navigate(`/training/addEvent/${props.data.bodyParts_code}`,
        )}
      >
        <ListItemText primary={props.data.bodyParts_name} />
      </ListItemButton>
      <Divider />
    </>
  );
}

const DispEventList = (props: any) => {
  const bodyPartsDatas = props.item;
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
    {bodyPartsDatas.map((bodyPartsData: any, index: number) => {
      return <DispEventListDetail data={bodyPartsData} key={bodyPartsData.bodyParts_code}/>
    })}
    </List>
  );
}

const App = () => {
  const [bodyPartsData, setBodyPartsData] = useState<Obj>([]);
  const URL = `/api/getAllBodyParts`;

  const [selectBodyValue, setBodyValue] = useState(1); // デフォルトは「胸」としておく
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setBodyValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(result => {
          setBodyPartsData(result);
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
      <div className="dispEventListArea">
        <DispEventList
          item={bodyPartsData}
          bodyValue={selectBodyValue}
          key={bodyPartsData.bodyParts_code}
        />
      </div>
    </>
  );
};

export default App;