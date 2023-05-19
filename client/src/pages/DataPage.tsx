import React from "react";
import DataTable from "../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";

const DataTablePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleGoBack}>Back</button>
      <DataTable />
    </div>
  );
};

export default DataTablePage;
