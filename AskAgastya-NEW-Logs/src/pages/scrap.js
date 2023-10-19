import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';

const useStyles = makeStyles({
  wrapText: {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
  },
});

const CustomTooltip = ({ active, payload, onClick }) => {
  if (active && payload && payload.length) {
    const { date, calls, grade } = payload[0].payload;
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        }}
        onClick={() => onClick(date)}
      >
        <p style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
          Calls: {calls}
        </p>
        <p style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
          Grade: {grade}
        </p>
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
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Metrics = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fetchingData, setFetchingData] = useState(false); // Add fetchingData flag
  const dataByClass = [
    { class: 'Class 8', calls: 10 },
    { class: 'Class 9', calls: 20 },
    { class: 'Class 10', calls: 8 },
  ];

  const dataBySubject = [
    { subject: 'Physics', calls: 15 },
    { subject: 'Biology', calls: 20 },
  ];

  const dataByAsr = [
    { subject: 'Correct', calls: 15 },
    { subject: 'Error', calls: 20 },
  ];

  const dataByMT = [
    { subject: 'Correct', calls: 15 },
    { subject: 'Error', calls: 20 },
  ];

  const dataByTTS = [
    { subject: 'Correct', calls: 15 },
    { subject: 'Error', calls: 20 },
  ];
  const cacheBuster = Date.now();
  const fetchData = async (pageNumber, maxPages) => {
    if (fetchingData) return; // Check if data fetch is already in progress
    setFetchingData(true); // Set the flag to indicate data fetch in progress

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

        if (callsByDate[date]) {
          callsByDate[date] += 1;
        } else {
          callsByDate[date] = 1;
        }
      });

      // Update the state after each successful fetch
      const formattedData = Object.keys(callsByDate).map(date => ({
        date,
        calls: callsByDate[date],
        grade: result.items.find(item => new Date(item.timestamp).toLocaleDateString() === date)?.grade
      }));

      setData(prevData => [...prevData, ...formattedData]);
      if (pageNumber < maxPages) {
        fetchData(pageNumber + 1, maxPages);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setFetchingData(false); // Reset the flag after data fetch
    }
  };

  useEffect(() => {
    const maxPages = 100; // Set your desired max number of pages
    fetchData(1, maxPages).catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate);
    }
  }, [selectedDate]);

  // Show only the latest 14 days on the X-axis
  const today = new Date();
  const last14Dates = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
    last14Dates.push(date);
  }

  // Create a data object for each date and count the calls for that date
  const callsByDate = {};
  data.forEach(item => {
    const date = new Date(item.date).toLocaleDateString();
    if (callsByDate[date]) {
      callsByDate[date] += item.calls;
    } else {
      callsByDate[date] = item.calls;
    }
  });

  // Create an array of objects with date and calls data for the last 14 dates
  const last14DaysData = last14Dates.map(date => ({
    date,
    calls: callsByDate[date] || 0,
    grade: data.find(item => item.date === date)?.grade
  }));

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Agsthaya Historical Metrics</h1>
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
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: "17vw" }}>
          <h2>Calls from Class</h2>
          <PieChart width={300} height={300}>
            <Pie data={dataByClass} dataKey="calls" nameKey="class" cx="50%" cy="50%" outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              sectorBorderColor="white"
              sectorBorderWidth={1}
            >
              {
                dataByClass.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#38CFD1', '#ffa46e', "#B2B028"][index % 3]} // Different light colors
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div style={{ marginLeft: "20vw" }}>
          <h2>Class from Subject</h2>
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
                    fill={['#84c1ff', '#2897B2'][index % 2]} // Different light colors
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      <div>
        <h1 style={{ textAlign: 'center' }}>Performance</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '300px', marginRight: '20px' }}>
            <h2>ASR Performance</h2>
            <PieChart width={300} height={300}>
              <Pie data={dataByAsr} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
                sectorBorderColor="white"
                sectorBorderWidth={1}
              >
                {
                  dataByAsr.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#84c1ff', '#ffa46e'][index % 2]} // Different light colors
                    />
                  ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div style={{ width: '300px', marginRight: '20px' }}>
            <h2>MT Performance</h2>
            <PieChart width={300} height={300}>
              <Pie data={dataByMT} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
                sectorBorderColor="white"
                sectorBorderWidth={1}
              >
                {
                  dataByMT.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#84c1ff', '#ffa46e'][index % 2]} // Different light colors
                    />
                  ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div style={{ width: '300px' }}>
            <h2>TTS Performance</h2>
            <PieChart width={300} height={300}>
              <Pie data={dataByTTS} dataKey="calls" nameKey="subject" cx="50%" cy="50%" outerRadius={70}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
                sectorBorderColor="white"
                sectorBorderWidth={1}
              >
                {
                  dataByTTS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#84c1ff', '#ffa46e'][index % 2]} // Different light colors
                    />
                  ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
