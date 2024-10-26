import React, { useState } from "react";
import axios from "axios";
import "./TableFilter.css";

const tableData = [
  { age: 25, salary: 50000, department: "CSE", experience: 2 },
  { age: 30, salary: 60000, department: "BIO", experience: 3 },
  { age: 22, salary: 45000, department: "MATH", experience: 1 },
  { age: 28, salary: 55000, department: "PHY", experience: 4 },
  { age: 35, salary: 70000, department: "CSE", experience: 5 },
  { age: 27, salary: 48000, department: "BIO", experience: 2 },
  { age: 33, salary: 72000, department: "MATH", experience: 6 },
  { age: 29, salary: 65000, department: "PHY", experience: 3 },
  { age: 31, salary: 68000, department: "CSE", experience: 4 },
  { age: 26, salary: 52000, department: "BIO", experience: 2 },
  { age: 24, salary: 52000, department: "PHY", experience: 1 },
  { age: 32, salary: 75000, department: "MATH", experience: 5 },
  { age: 34, salary: 72000, department: "BIO", experience: 4 },
  { age: 23, salary: 31000, department: "PHY", experience: 1 },
];

const TableFilter = ({ rule }) => {
  const [filteredData, setFilterredData] = useState([]);
  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/evaluate-rule", {
        rule: rule,
        rows: tableData,
      });
      setFilterredData(response.data.filtered_data);
    } catch (error) {
      console.error("Error processing rule:", error);
    }
  };

  return (
    <>
      <h1>Rule Filter</h1>
      <div className="filter">
        <Table data={tableData} />
        <button onClick={handleFilter}>Filter</button>
        {filteredData.length ? <Table data={filteredData} /> : null}
      </div>
    </>
  );
};

function Table({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Age</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Salary</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Department
          </th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Experience
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.age}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.salary}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.department}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.experience}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableFilter;
