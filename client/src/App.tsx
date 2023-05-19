import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DataTablePage from "./pages/DataPage";
import ChartPage from "./pages/Chart";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/datatable" Component={DataTablePage} />
        <Route path="/chartpage" Component={ChartPage} />
      </Routes>
    </Router>
  );
};

export default App;
