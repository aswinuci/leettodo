import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const data = require('./data/data.json');

const ProblemGrid = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('solvedData')) || {};
    const processedData = data.map((item, index) => ({
      sno: index + 1,
      title: item.title,
      link: item.link,
      problem: { title: item.title, href: item.link },
      difficulty: item.difficulty,
      companies: item.companies.map(c => `${c.company}: ${c.frequency}`).join(', '),
      solved: storedData[item.link] || false
    }));
    setRowData(processedData);
  }, []);

  const handleCheckboxChange = (params) => {
    const updatedRowData = rowData.map((row) => {
      if (row.link === params.node.data.link) {
        return { ...row, solved: !row.solved };
      }
      return row;
    });
    setRowData(updatedRowData);
    const updatedStorageData = updatedRowData.reduce((acc, row) => {
      acc[row.link] = row.solved;
      return acc;
    }, {});
    localStorage.setItem('solvedData', JSON.stringify(updatedStorageData));
  };

  const columnDefs = [
    { headerName: "Sno", field: "sno", width: 60, filter: 'agNumberColumnFilter' },
    { headerName: "Title", field: "title", width: 370, filter: 'agTextColumnFilter' },
    {headerName: "Link", field: "link", width: 100, filter: 'agTextColumnFilter', cellRenderer: (params) => {
        return <a href={params.value || ""} target="_blank" rel="noopener noreferrer">Link</a>; 
    }},
    {headerName: "Difficulty", field: "difficulty", width: 100, filter: 'agTextColumnFilter'},
    { headerName: "Companies", field: "companies", width: 800, filter: 'agTextColumnFilter' },
    { headerName: "Solved?", field: "solved", width: 100, filter: 'agSetColumnFilter', cellRenderer: (params) => {
        return (
          <input
            type="checkbox"
            checked={params.value}
            onChange={() => handleCheckboxChange(params)}
          />
        );
      }
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: '85vh', width: '97%', margin: '20px' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{
          sortable: true,
          filter: true,
        }}
        pagination={true}
        paginationPageSize={60}
      />
    </div>
  );
};

export default ProblemGrid;
