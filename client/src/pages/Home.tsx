import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="homepage">
      <h1>Technical Assignment</h1>
      <Link to="/datatable">Go to Data Table</Link>
      <Link to="/chartpage">Go to Chart Page</Link>
    </div>
  );
};

export default Home;
