
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';


const useStyles = makeStyles({
  wrapText: {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
  },
});

const CustomTooltip = ({ active, payload, onClick }) => {
  const classes = useStyles();
  if (active && payload && payload.length) {
    const { class: className, calls, ...subjectData } = payload[0].payload;
    // Remove the from_mobile column from subjectData object
    delete subjectData.from_mobile;

    const subjectItems = Object.keys(subjectData).map(subject => (
      <p key={subject} style={{ marginBottom: '5px', fontSize: '14px' }}>
        {subject}: {subjectData[subject]}
      </p>
    ));

    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        }}
        onClick={() => onClick(className)}
      >
        <p style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
          Calls: {calls}
        </p>
        {subjectItems}
      </div>
    );
  }
  return null;
};
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Metrics = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [filterModel, setFilterModel] = useState({ items: [] }); //
  const cacheBuster = Date.now();

  const fetchData = async (pageNumber, maxPages) => {
    if (fetchingData) return;

    setFetchingData(true);

    try {
      const apiUrl = `http://askagastya.iiithcanvas.com/questions/answers/correct?page=${pageNumber}&size=100&rated=false&_cb=${cacheBuster}`;
      const response = await fetch(apiUrl);
      const result = await response.json();
      const callsByDate = {};

      if (result.items.length === 0) {
        setLoading(false);
        return;
      }

      result.items.forEach(item => {
        const date = new Date(item.timestamp).toLocaleDateString();

        // Extract and store grade and subject information
        const grade = item.grade;
        const subject = item.subject || 'Unknown';

        if (!callsByDate[date]) {
          callsByDate[date] = { date, calls: 0 };
        }
        if (!callsByDate[date][grade]) {
          callsByDate[date][grade] = 0;
        }
        if (!callsByDate[date][subject]) {
          callsByDate[date][subject] = 0;
        }
        callsByDate[date][grade] += 1;
        callsByDate[date][subject] += 1;

        callsByDate[date].from_mobile = item.from_mobile;
        callsByDate[date].calls += 1;
      });

      const formattedData = Object.keys(callsByDate).map(date => ({
        date,
        calls: callsByDate[date].calls,
        ...callsByDate[date],
      }));

      setData(prevData => [...prevData, ...formattedData]);

      // Create data1 with the desired format of data
      const formattedData1 = result.items.reduce((prev, curr) => {
        const date = new Date(curr.timestamp).toLocaleDateString();
        const { from_mobile, ...rest } = curr;
        const mobileNum = curr.from_mobile;

        // If there is already an entry for the current date in data1, 
        // just update the call count and add the mobile number to the object
        const index = prev.findIndex((obj) => obj.date === date);
        if (index !== -1) {
          prev[index].calls += 1;
          prev[index][mobileNum] = (prev[index][mobileNum] || 0) + 1;
          Object.entries(rest).forEach(([key, value]) => {
            if (prev[index][key]) {
              prev[index][key] += 1;
            } else {
              prev[index][key] = 1;
            }
          });
        } else {
          // If there is no entry for the current date in data1, create a new object
          const newObj = { date, calls: 1, [mobileNum]: 1, ...rest };
          prev.push(newObj);
        }
        return prev;
      }, []);

      setData1(prevData => [...prevData, ...formattedData1]);

      if (pageNumber < maxPages) {
        fetchData(pageNumber + 1, maxPages);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    const maxPages = 100;
    fetchData(1, maxPages).catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate);
    }
  }, [selectedDate]);

  const today = new Date().toLocaleDateString();
  const last14Dates = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
    last14Dates.push(date);
  }

  const callsByDate = {};
  data.forEach(item => {
    const date = new Date(item.date).toLocaleDateString();
    if (callsByDate[date]) {
      callsByDate[date] += item.calls;
    } else {
      callsByDate[date] = item.calls;
    }
  });

  const last14DaysData = last14Dates.map(date => ({
    date,
    calls: callsByDate[date] || 0,
    ...(callsByDate[date] && data.find(item => item.date === date)),
  }));

  const todayData = data.filter(item => item.date === today).reduce((acc, curr) => {
    Object.keys(curr).forEach(key => {
      if (key !== 'date' && key !== 'calls') {
        if (acc[key]) {
          acc[key] += curr[key];
        } else {
          acc[key] = curr[key];
        }
      }
    });
    return acc;
  }, {});

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
    last7Days.push(date);
  }

  const callsByClassLast7Days = last7Days.reduce((total, date) => {
    const dateData = data.filter(item => item.date === date).reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'date' && key !== 'calls') {
          if (acc[key]) {
            acc[key] += curr[key];
          } else {
            acc[key] = curr[key];
          }
        }
      });
      return acc;
    }, {});

    Object.keys(dateData).forEach(key => {
      if (key !== 'date' && key !== 'calls') {
        if (total[key]) {
          total[key] += dateData[key];
        } else {
          total[key] = dateData[key];
        }
      }
    });
    return total;
  }, {});

  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
    last30Days.push(date);
  }

  const callsByClassLast30Days = last30Days.reduce((total, date) => {
    const dateData = data.filter(item => item.date === date).reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'date' && key !== 'calls') {
          if (acc[key]) {
            acc[key] += curr[key];
          } else {
            acc[key] = curr[key];
          }
        }
      });
      return acc;
    }, {});

    Object.keys(dateData).forEach(key => {
      if (key !== 'date' && key !== 'calls') {
        if (total[key]) {
          total[key] += dateData[key];
        } else {
          total[key] = dateData[key];
        }
      }
    });
    return total;
  }, {});

  const dataByClass = Object.keys(todayData)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls' && key !== 'Biology' && key !== 'Physics') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({ class: `Class ${key}`, calls: todayData[key] }));

  const dataByClassLast7Days = Object.keys(callsByClassLast7Days)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls' && key !== 'Biology' && key !== 'Physics') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({ class: `Class ${key}`, calls: callsByClassLast7Days[key] }));

  const dataByClassLast30Days = Object.keys(callsByClassLast30Days)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls' && key !== 'Biology' && key !== 'Physics') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({ class: `Class ${key}`, calls: callsByClassLast30Days[key] }));

  const dataBySubject = Object.keys(todayData)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls' && key !== '8' && key !== '9'&& key !== '10') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({
      class: `Class ${key}`,
      calls: todayData[key],
      // Display subject names when calls are greater than 0, else display subject names for "0" and "1".
      subject: todayData[key] > 0 ? ` ${key}` : todayData[key] === 1 ? 'Biology' : 'Physics',
    }));

  const dataBySubjectLast7Days = Object.keys(callsByClassLast7Days)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls'  && key !== '8' && key !== '9'&& key !== '10') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({
      class: `Class ${key}`,
      calls: callsByClassLast7Days[key],
      // Display subject names when calls are greater than 0, else display subject names for "0" and "1".
      subject: callsByClassLast7Days[key] > 0 ? ` ${key}` : callsByClassLast7Days[key] === 1 ? 'Biology' : 'Physics',
    }));

  const dataBySubjectLast30Days = Object.keys(callsByClassLast30Days)
    .filter(key => key !== 'subject' && key !== 'from_mobile' && key !== 'calls' && key !== '8' && key !== '9'&& key !== '10') // Filter out 'subject', 'from_mobile', and 'calls', and restrict 'Biology' and 'Physics'
    .map(key => ({
      class: `Class ${key}`,
      calls: callsByClassLast30Days[key],
      // Display subject names when calls are greater than 0, else display subject names for "0" and "1".
      subject: callsByClassLast30Days[key] > 0 ? ` ${key}` : callsByClassLast30Days[key] === 1 ? 'Biology' : 'Physics',
    }));

  const filteredDataByClass = dataByClass.filter(item => item.class !== 'Class physics' && item.class !== 'Class biology');
  const filteredDataByClassLast7Days = dataByClassLast7Days.filter(item => item.class !== 'Class physics' && item.class !== 'Class biology');
  const filteredDataByClassLast30Days = dataByClassLast30Days.filter(item => item.class !== 'Class physics' && item.class !== 'Class biology');

  const chartTitle = `Calls from Class ${today}`;
  const chartTitleLast7Days = `Calls by Class (Last 7 Days)`;
  const chartTitleLast30Days = `Calls by Class (Last 30 Days)`;
  const chartTitleBySubject = `Calls by Subject (Today)`;
  const chartTitleBySubjectLast7Days = `Calls by Subject (Last 7 Days)`;
  const chartTitleBySubjectLast30Days = `Calls by Subject (Last 30 Days)`;

 //console.log(data1) 

 const mobileNumsAndCalls = data1.flatMap((item, index) => {
  const { calls, ...mobileCounts } = item;
  return Object.entries(mobileCounts)
    .filter(([key]) => /^[0-9]+$/.test(key)) // Filter out non-mobile-number properties
    .map(([mobileNum, count]) => ({ id: `${mobileNum}-${index}`, mobileNum, count })); // Add id property
}).reduce((acc, curr) => {
  const index = acc.findIndex(obj => obj.mobileNum === curr.mobileNum);
  if (index === -1) {
    return [...acc, curr];
  }
  acc[index].count += curr.count;
  return acc;
}, []);
console.log(mobileNumsAndCalls)

const totalCalls = data.reduce((total, item) => total + item.calls, 0);
console.log(totalCalls)


  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Agsthaya Historical Metrics</h1>
      <h3 style={{ textAlign: 'center' }}>Total Calls till now: {totalCalls}</h3>
      <h2 style={{ textAlign: 'center', marginTop: '5vh' }}>Weekly Calls</h2>
      <BarChart width={1500} height={500} data={last14DaysData} style={{ margin: 'auto' }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Legend />
        <Tooltip content={<CustomTooltip onClick={setSelectedDate} />} />
        <Bar dataKey="calls" fill="#8884d8" onClick={(data, index) => {
          console.log(data.date);
          if (data.grade) {
            console.log('Grade:', data.grade);
          }
        }} />
      </BarChart>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: "300px",marginRight:"5vw" }}>
        <h2>{chartTitle}</h2>
          {
  filteredDataByClass.length === 0 ? (
    <div style={{marginTop:"18vh"}}>
    <h7 style={{textAlign: 'center'}}>Sorry! No calls made today </h7>
    </div>
  ) : (
    <div style={{width: "300px",marginRight:"5vw"}}>
          <PieChart width={300} height={300}>
            <Pie data={filteredDataByClass} dataKey="calls" nameKey="class" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                filteredDataByClass.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e', "#B2B028"][index % 3]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
    </div>
  )
}
         
        </div>
        <div style={{ width: "300px" ,marginRight:"5vw"}}>
          <h2>{chartTitleLast7Days}</h2>
          <PieChart width={300} height={300}>
            <Pie data={filteredDataByClassLast7Days} dataKey="calls" nameKey="class" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                filteredDataByClassLast7Days.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e', "#B2B028"][index % 3]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
        </div>
        <div style={{ width: "300px" }}>
          <h2>{chartTitleLast30Days}</h2>
          <PieChart width={300} height={300}>
            <Pie data={filteredDataByClassLast30Days} dataKey="calls" nameKey="class" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                filteredDataByClassLast30Days.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e', "#B2B028"][index % 3]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5vh' }}>
         
    
        <div style={{ width: "300px" ,marginRight:"5vw"}}>
        <h2>{chartTitleBySubject}</h2>
        {
  dataBySubject.length === 0 ? (
    <div style={{marginTop:"18vh"}}>
    <h7 style={{textAlign: 'center'}}>Sorry! No calls made today </h7>
    </div>
  ) : (
    <div style={{width: "300px",marginRight:"5vw"}}>

          <PieChart width={300} height={300}>
            <Pie data={dataBySubject} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                dataBySubject.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e'][index % 2]}
                  />
                ))
              }
            </Pie>
            <Tooltip  />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
    </div>
  )
}
          
        </div>
        <div style={{ width: "300px",marginRight:"5vw" }}>
          <h2>{chartTitleBySubjectLast7Days}</h2>
          <PieChart width={300} height={300}>
            <Pie data={dataBySubjectLast7Days} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                dataBySubjectLast7Days.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e'][index % 2]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
        </div>
        <div style={{ width: "300px" }}>
          <h2>{chartTitleBySubjectLast30Days}</h2>
          <PieChart width={300} height={300}>
            <Pie data={dataBySubjectLast30Days} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                dataBySubjectLast30Days.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e'][index % 2]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              formatter={(value, entry) => <span style={{color: 'black'}}>{value}</span>} 
            /> 
          </PieChart>
        </div>
</div>  
<div style={{ height: "20%", width: '25%', justifyContent: 'center', alignItems: 'center', marginLeft: '34vw' }}>
  <h2>Caller and calls count</h2>
 <DataGrid rows={mobileNumsAndCalls} columns={[
  { field: 'mobileNum', headerName: 'Mobile Number', width: 200,sortable:false },
  { field: 'count', headerName: 'Call Count', width: 200 },
]}
initialState={{
  pagination: {
    paginationModel: {
      pageSize: 25,
    },
  },
  sortModel: {
    field: 'count',
    sort: 'desc',
  },
}}
pageSizeOptions={[25,50,100]}
disableSelectionOnClick
disableColumnMenu
          getRowHeight={() => 'auto'}
          slots={{ toolbar: GridToolbar, export: GridToolbarExport, container: GridToolbarContainer }}
/> 

</div>
 </div>
  );
};

export default Metrics;