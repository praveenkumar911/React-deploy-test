import logo from './logo.svg';
import './App.css';
import Dashboard from './new';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Metrics from './new1';
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/q" element={<Metrics/>} />
          <Route path="*" element={<> not found</>} />
        </Routes>
    </Router>
  );
}

export default App;
