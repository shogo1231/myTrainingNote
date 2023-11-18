import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import  Router from "./router/Router";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
    <Router />
  </React.StrictMode>
);

// PNG画像の読み込ませ方サンプル
// 不要だがサンプルとして残しておく
// const imageSrc = require('./images/favicon.png')
// const imgDOM = ReactDOM.createRoot(
//   document.getElementById('image') as HTMLElement
// );
// imgDOM.render(
//   <React.StrictMode>
//     <div>
//       <img src={imageSrc}></img>
//     </div>
//   </React.StrictMode>
// );