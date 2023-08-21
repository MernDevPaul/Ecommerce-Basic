import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Assets/Css/MasterCss.css'
import "./Assets/Css/Style.css";
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import Store from "./Redux/Store";
const ecommerce = ReactDOM.createRoot(document.getElementById("ecommerce"));
ecommerce.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
