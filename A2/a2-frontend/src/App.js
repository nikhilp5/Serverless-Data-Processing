import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import HomePage from "./HomePage";
import Startup from "./Startup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startup />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/homepage" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
