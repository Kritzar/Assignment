import React, { useState } from "react";
import axios from "axios";
import "./Visualiser.css";

function Visualiser({ rule }) {
  const [processedRule, setProcessedRule] = useState("");

  const handleVisualise = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/process-rule", {
        rule: rule,
      });
      setProcessedRule(response.data.processed_rule);
    } catch (error) {
      console.error("Error processing rule:", error);
    }
  };
  return (
    // TODO: remove extra styling
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handleVisualise}>Show</button>
        {processedRule && (
          <div
            style={{
              marginLeft: "20px",
              fontWeight: "bold",
              whiteSpace: "pre-wrap",
            }}
          >
            {processedRule}
          </div>
        )}
      </div>
    </div>
  );
}

export default Visualiser;
