// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderForm from './component/orders/OrderForm'; // Your home component
import Login from './component/orders/login/login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/orders" element={<OrderForm />} />
        <Route path="/" element={<Login />} />        {/* Home page */}
      </Routes>
    </div>
  );
}

export default App;
