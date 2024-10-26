import React, { useState } from "react";
import axios from "axios";
import "./Combiner.css";

function Combiner() {
  const [processedRule, setProcessedRule] = useState("");
  const [firstRule, setFirstRule] = useState("");
  const [secondRule, setSecondRule] = useState("");

  const handleVisualise = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/combine-rules", {
        rules: [firstRule, secondRule],
      });
      setProcessedRule(response.data.processed_rule);
    } catch (error) {
      console.error("Error processing rule:", error);
    }
  };
  return (
    <>
      <h1>Rule Combiner</h1>

      <div className="visualiser">
        <div className="rules-container">
          <textarea
            value={firstRule}
            onChange={(e) => {
              setFirstRule(e.target.value);
            }}
            rows="8"
            cols="70"
            placeholder="Enter your rule "
          />
          <span class="plus-sign">+</span>

          <textarea
            value={secondRule}
            onChange={(e) => {
              setSecondRule(e.target.value);
            }}
            rows="8"
            cols="70"
            placeholder="Enter your rule "
          />
        </div>
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
      <br />
      <br />
    </>
  );
}

export default Combiner;
