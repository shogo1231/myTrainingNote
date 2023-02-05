import React from "react";

interface Fruit {
  id: string;
  name: string;
}

const App: React.FC = () => {
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

  return (
    <div className="container fruitsList">
      <h1>アカウント情報</h1>

      {userDatas?.map((fruit: Fruit) => (
        <div key={fruit.id}>
          <div className="text">
            <h2>{fruit.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;