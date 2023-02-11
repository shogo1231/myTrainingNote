import React from 'react';
import Header from "./Header";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';
import '../css/AccountList.css';

interface Fruit {
  id: string;
  name: string;
}

const App = () => {
  const [userDatas, setFruits] = React.useState([]);
  const URL = '/api/getUser';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(json => {
          setFruits(json);
        })
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const Item = (props: any) => {
    return (
      <div className="text">
        <h2>{props.name}</h2>
      </div>
    );
  };

  const handleDateClick = () => { // bind with an arrow function
    alert('click')
  }

  return (
    <>
      <Header />
      <div className="container fruitsList">
        <h1>アカウント情報</h1>

        {userDatas?.map((fruit: Fruit, index) => {
          return <Item key={index} name={fruit.name} ></Item>;
        })}
      </div>
      <div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        locales={[jaLocale]}
        locale='ja'
        dateClick={handleDateClick}
        // weekends={true} // 週末を強調表示する。
        titleFormat={{ // タイトルのフォーマット。
          year: 'numeric',
          month: 'short',
        }}
        // customButtons= {{ // カスタムボタン設置用
        //   'change': {
        //     text: '週表示',
        //     click: function() {
        //       alert('clicked the custom button!');
        //     }
        //   }
        // }}
        headerToolbar={{ // カレンダーのヘッダー設定。
          start: 'title',
          center: 'dayGridMonth,dayGridWeek',
          right: 'prev,next today',
        }}
        buttonText={ {
          today: '今日',
          month: '月表示',
          week: '週表示',
          list: 'リスト'
        }}
        height={ 300 }
      />
      </div>
    </>
  );
};

export default App;