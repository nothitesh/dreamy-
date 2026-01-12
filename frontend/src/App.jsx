import styled from "styled-components";
import Center from "./components/Center.jsx";
import Leftside from "./components/Leftside.jsx";
import Rightside from "./components/Rightside.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Register from "./components/Register.jsx";
import Logout from "./components/Logout.jsx";

function HomePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <>
    <Logout/>
    <Layout>
      <Leftside
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Center selectedDate={selectedDate}/>
      <Rightside selectedDate={selectedDate} />
    </Layout>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 0;
  min-height: 100vh;
  width: 100%;
  background-color: #262626;
`;

export default App;