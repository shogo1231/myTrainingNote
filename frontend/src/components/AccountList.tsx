import React from 'react';
import Header from "./Header";
import '../App.css';

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

  return (
    <>
      <Header />
      <div className="container fruitsList">
        <h1>アカウント情報</h1>

        {userDatas?.map((fruit: Fruit, index) => {
          return <Item key={index} name={fruit.name} ></Item>;
        })}
      </div>
    </>
  );
};

export default App;