import { BrowserRouter, Routes, Route } from "react-router-dom";

import Universe from "./components/Universe";
import Home from "./components/Home";


const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Universe />} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;
