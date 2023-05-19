import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Technical Assignment</h1>
      <Link to="/datatable">Go to Data Table</Link>
      <Link to="/chartpage">Go to Chart Page</Link>
    </div>
  );
};

export default Home;
