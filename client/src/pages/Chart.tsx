import React from "react";
import ChartPage from "../components/ChartPage/ChartPage";
import { useNavigate } from "react-router-dom";

const Chart: React.FC = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button onClick={handleGoBack}>Back</button>
      <ChartPage />
    </div>
  );
};

export default Chart;
