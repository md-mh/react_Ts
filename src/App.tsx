import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import AppLayout from "./components/Layout/AppLayout";

const theme = {
  token: {
    colorPrimary: "#1a1a2e",
    borderRadius: 8,
    colorBgContainer: "#ffffff",
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
