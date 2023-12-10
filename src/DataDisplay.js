// DataDisplay.js
import React, { useEffect } from 'react';

const DataDisplay = ({ userData, onLogout,data }) => {
  const { email, role,token } = userData;
  
  useEffect(() => {
    console.log('Data updated:', data);
  }, [data]);

  return (
    <div>
      <h2>Data Display</h2>
      <p>Welcome</p>
 {/*      
      <p>{token}</p> */}
      {/* Display data based on user role */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default DataDisplay;
