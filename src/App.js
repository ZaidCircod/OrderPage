// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderForm from './component/orders/OrderForm'; // Your home component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<OrderForm />} />        {/* Home page */}
      </Routes>
    </div>
  );
}

export default App;
