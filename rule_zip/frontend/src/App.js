import React, { useState } from "react";
import Visualiser from "./components/Visualiser";
import TableFilter from "./components/TableFilter";
import "./App.css";
import Combiner from "./components/Combiner";

function App() {
  const [rule, setRule] = useState("");

  return (
    <>
      <h1>Rule Processor</h1>
      <div className="visualiser">
        <textarea
          className="main-rule"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          rows="8"
          cols="50"
          placeholder="Enter your rule "
        />
        <Visualiser rule={rule} />
      </div>
      <TableFilter rule={rule} />
      <Combiner />
    </>
  );
}

export default App;
