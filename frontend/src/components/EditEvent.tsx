import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./Header";
import '../App.css';
import '../SelectEvent.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const register = (bodyParts_code: string, trainingEventName: string, navigate: any) => {
  const sendData = {
    bodyPartsCode: bodyParts_code,
    trainingEventName: trainingEventName,
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
      navigate(`/training/addEvent/${bodyParts_code}`)
    })
  }
  catch (e) {
    console.error(e);
  }
}

const App = () => {
  const navigate = useNavigate();

  // クエリパラメータから部位判定する。
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const bodyParts_code = query.get('code');
  const bodyParts_name = query.get('name');

  const [trainingEventName, setTrainingEventName ] = useState<string>();

  return (
    <>
      <Header />
      <div className="center">
        <div className=".editEventTitleTitle">
          <h3>種目追加・修正</h3>
        </div>
        <div className="editEventTextArea">
          <TextField
            id="standard-basic"
            label="部位"
            variant="standard"
            defaultValue={bodyParts_name}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="editEventTextArea">
          <TextField
            id="standard-basic"
            label="種目名"
            variant="standard"
            sx={{ width: '250px' }}
            onChange={(event)=> {
              setTrainingEventName(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="outer trainingEventRegisterButton">
        <Button
          variant="contained"
          onClick={() =>
            register(bodyParts_code, trainingEventName, navigate)
          }
        >登録
        </Button>
      </div>
    </>
  );
};

export default App;