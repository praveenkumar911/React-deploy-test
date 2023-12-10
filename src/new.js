import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  const fetchData = async (pageNumber, maxPages) => {
    if (fetchingData) return;

    setFetchingData(true);

    try {
      const apiUrl = `http://askagastya.iiithcanvas.com/questions/answers/correct?page=${pageNumber}&size=100&rated=false&_cb=${Date.now()}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.items.length > 0) {
        setData((prevData) => [...prevData, ...result.items]);
        if (pageNumber < maxPages) {
          // Add a delay between successive API calls to avoid making too many requests too quickly
          await new Promise(resolve => setTimeout(resolve, 1000));
          await fetchData(pageNumber + 1, maxPages);
        } else {
          setFetchingData(false);
        }
      } else {
        setFetchingData(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchingData(false);
    }
  };

  useEffect(() => {
    const maxPages = 5;
    fetchData(1, maxPages).catch(error => console.error(error));
  }, []);
  const processData = (days) => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - days);

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= currentDate;
    });

    const uniqueDates = Array.from(new Set(filteredData.map(item => new Date(item.timestamp).toLocaleDateString())));

    const result = uniqueDates.map(date => {
      const entry = {
        date,
        total: 0,
      };

      if (selectedCategory === 'audio') {
        entry.audio_quality_up = 0;
        entry.audio_quality_down = 0;
        entry.audio_quality_neutral = 0;
      } else if (selectedCategory === 'asr') {
        entry.asr_rate_up = 0;
        entry.asr_rate_down = 0;
        entry.asr_rate_neutral = 0;
      } else if (selectedCategory === 'mtEng') {
        entry.mt_rate_eng_up = 0;
        entry.mt_rate_eng_down = 0;
        entry.mt_rate_eng_neutral = 0;
      } else if (selectedCategory === 'mtTel') {
        entry.mt_rate_tel_up = 0;
        entry.mt_rate_tel_down = 0;
        entry.mt_rate_tel_neutral = 0;
      } else if (selectedCategory === 'tts') {
        entry.tts_rate_up = 0;
        entry.tts_rate_down = 0;
        entry.tts_rate_neutral = 0;
      } else if (selectedCategory === 'subtl') {
        entry.subtl_up = 0;
        entry.subtl_down = 0;
        entry.subtl_neutral = 0;
      }

      return entry;
    });

    filteredData.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      const entry = result.find(entry => entry.date === date);

      if (entry) {
        if (selectedCategory === 'audio') {
          entry.audio_quality_up += item.audio_quality_rate === 'up' ? 1 : 0;
          entry.audio_quality_neutral += item.audio_quality_rate === 'neutral' ? 1 : 0;
          entry.audio_quality_down += item.audio_quality_rate === 'down' ? 1 : 0;
        } else if (selectedCategory === 'asr') {
          entry.asr_rate_up += item.asr_rate === 'up' ? 1 : 0;
          entry.asr_rate_down += item.asr_rate === 'down' ? 1 : 0;
          entry.asr_rate_neutral += item.asr_rate === 'neutral' ? 1 : 0;
        } else if (selectedCategory === 'mtEng') {
          entry.mt_rate_eng_up += item.mt_rate_eng === 'up' ? 1 : 0;
          entry.mt_rate_eng_down += item.mt_rate_eng === 'down' ? 1 : 0;
          entry.mt_rate_eng_neutral += item.mt_rate_eng === 'neutral' ? 1 : 0;
        } else if (selectedCategory === 'mtTel') {
          entry.mt_rate_tel_up += item.mt_rate_tel === 'up' ? 1 : 0;
          entry.mt_rate_tel_down += item.mt_rate_tel === 'down' ? 1 : 0;
          entry.mt_rate_tel_neutral += item.mt_rate_tel === 'neutral' ? 1 : 0;
        } else if (selectedCategory === 'tts') {
          entry.tts_rate_up += item.tts_rate === 'up' ? 1 : 0;
          entry.tts_rate_down += item.tts_rate === 'down' ? 1 : 0;
          entry.tts_rate_neutral += item.tts_rate === 'neutral' ? 1 : 0;
        } else if (selectedCategory === 'subtl') {
          entry.subtl_up += item.subtl_answer_content_rate === 'up' ? 1 : 0;
          entry.subtl_down += item.subtl_answer_content_rate === 'down' ? 1 : 0;
          entry.subtl_neutral += item.subtl_answer_content_rate === 'neutral' ? 1 : 0;
        }

        entry.total += 1;
      }
    });

    return result;
  };

  const handleCheckboxChange = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const chartData = processData(30);
  const last7DaysChartData = processData(7);
  const last14DaysChartData = processData(14);
 console.log(chartData);
 console.log(last7DaysChartData);
 console.log(last14DaysChartData);
 const processData1 = (filterDate = null) => {
  const filteredData = filterDate ? data.filter(item => new Date(item.timestamp).toLocaleDateString() === filterDate) : data;

  const uniqueTimestamps = Array.from(new Set(filteredData.map(item => new Date(item.timestamp).toLocaleTimeString())));

  const result = uniqueTimestamps.map(time => {
    const entry = {
      time,
      count: 0,
    };

    if (selectedCategory === 'audio') {
      entry.audio_quality_up = 0;
      entry.audio_quality_down = 0;
      entry.audio_quality_neutral = 0;
    } else if (selectedCategory === 'asr') {
      entry.asr_rate_up = 0;
      entry.asr_rate_down = 0;
      entry.asr_rate_neutral = 0;
    } else if (selectedCategory === 'mtEng') {
      entry.mt_rate_eng_up = 0;
      entry.mt_rate_eng_down = 0;
      entry.mt_rate_eng_neutral = 0;
    } else if (selectedCategory === 'mtTel') {
      entry.mt_rate_tel_up = 0;
      entry.mt_rate_tel_down = 0;
      entry.mt_rate_tel_neutral = 0;
    } else if (selectedCategory === 'tts') {
      entry.tts_rate_up = 0;
      entry.tts_rate_down = 0;
      entry.tts_rate_neutral = 0;
    } else if (selectedCategory === 'subtl') {
      entry.subtl_up = 0;
      entry.subtl_down = 0;
      entry.subtl_neutral = 0;
    }

    return entry;
  });

  filteredData.forEach(item => {
    const time = new Date(item.timestamp).toLocaleTimeString();
    const entry = result.find(entry => entry.time === time);

    if (entry) {
      if (selectedCategory === 'audio') {
        entry.audio_quality_up += item.audio_quality_rate === 'up' ? 1 : 0;
        entry.audio_quality_neutral += item.audio_quality_rate === 'neutral' ? 1 : 0;
        entry.audio_quality_down += item.audio_quality_rate === 'down' ? 1 : 0;
      } else if (selectedCategory === 'asr') {
        entry.asr_rate_up += item.asr_rate === 'up' ? 1 : 0;
        entry.asr_rate_down += item.asr_rate === 'down' ? 1 : 0;
        entry.asr_rate_neutral += item.asr_rate === 'neutral' ? 1 : 0;
      } else if (selectedCategory === 'mtEng') {
        entry.mt_rate_eng_up += item.mt_rate_eng === 'up' ? 1 : 0;
        entry.mt_rate_eng_down += item.mt_rate_eng === 'down' ? 1 : 0;
        entry.mt_rate_eng_neutral += item.mt_rate_eng === 'neutral' ? 1 : 0;
      } else if (selectedCategory === 'mtTel') {
        entry.mt_rate_tel_up += item.mt_rate_tel === 'up' ? 1 : 0;
        entry.mt_rate_tel_down += item.mt_rate_tel === 'down' ? 1 : 0;
        entry.mt_rate_tel_neutral += item.mt_rate_tel === 'neutral' ? 1 : 0;
      } else if (selectedCategory === 'tts') {
        entry.tts_rate_up += item.tts_rate === 'up' ? 1 : 0;
        entry.tts_rate_down += item.tts_rate === 'down' ? 1 : 0;
        entry.tts_rate_neutral += item.tts_rate === 'neutral' ? 1 : 0;
      } else if (selectedCategory === 'subtl') {
        entry.subtl_up += item.subtl_answer_content_rate === 'up' ? 1 : 0;
        entry.subtl_down += item.subtl_answer_content_rate === 'down' ? 1 : 0;
        entry.subtl_neutral += item.subtl_answer_content_rate === 'neutral' ? 1 : 0;
      }

      entry.count += 1;
    }
  });

  return result;
};

const todayChartData = processData1(new Date().toLocaleDateString());
console.log(todayChartData)
  return (
    <>
      <div>
        <h1>Last 30 Days</h1>
        <div>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'audio'}
              onChange={() => handleCheckboxChange('audio')}
            />
            Audio
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'asr'}
              onChange={() => handleCheckboxChange('asr')}
            />
            ASR
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'mtEng'}
              onChange={() => handleCheckboxChange('mtEng')}
            />
            MT Eng
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'mtTel'}
              onChange={() => handleCheckboxChange('mtTel')}
            />
            MT Tel
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'tts'}
              onChange={() => handleCheckboxChange('tts')}
            />
            TTS
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'subtl'}
              onChange={() => handleCheckboxChange('subtl')}
            />
            Subtl
          </label>
        </div>
        <LineChart width={1200} height={400} data={chartData}>
          <XAxis dataKey="date" type="category" label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {selectedCategory === 'audio' && (
            <>
              <Line type="monotone" dataKey="audio_quality_up" name="Audio Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="audio_quality_down" name="Audio Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="audio_quality_neutral" name="Audio Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'asr' && (
            <>
              <Line type="monotone" dataKey="asr_rate_up" name="ASR Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="asr_rate_down" name="ASR Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="asr_rate_neutral" name="ASR Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'mtEng' && (
            <>
              <Line type="monotone" dataKey="mt_rate_eng_up" name="MT Eng Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="mt_rate_eng_down" name="MT Eng Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="mt_rate_eng_neutral" name="MT Eng Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'mtTel' && (
            <>
              <Line type="monotone" dataKey="mt_rate_tel_up" name="MT Tel Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="mt_rate_tel_down" name="MT Tel Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="mt_rate_tel_neutral" name="MT Tel Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'tts' && (
            <>
              <Line type="monotone" dataKey="tts_rate_up" name="TTS Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="tts_rate_down" name="TTS Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="tts_rate_neutral" name="TTS Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'subtl' && (
            <>
              <Line type="monotone" dataKey="subtl_up" name="Subtl Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="subtl_down" name="Subtl Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="subtl_neutral" name="Subtl Neutral" stroke="#ffc658" />
            </>
          )}
          <Line type="monotone" dataKey="total" name="Total" stroke="#000000" />
        </LineChart>
      </div>
      <div>
        <h1>Today</h1>
        <LineChart width={1200} height={400} data={todayChartData}>
          <XAxis dataKey="time" type="category" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {selectedCategory === 'audio' && (
            <>
              <Line type="monotone" dataKey="audio_quality_up" name="Audio Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="audio_quality_down" name="Audio Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="audio_quality_neutral" name="Audio Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'asr' && (
            <>
              <Line type="monotone" dataKey="asr_rate_up" name="ASR Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="asr_rate_down" name="ASR Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="asr_rate_neutral" name="ASR Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'mtEng' && (
            <>
              <Line type="monotone" dataKey="mt_rate_eng_up" name="MT Eng Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="mt_rate_eng_down" name="MT Eng Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="mt_rate_eng_neutral" name="MT Eng Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'mtTel' && (
            <>
              <Line type="monotone" dataKey="mt_rate_tel_up" name="MT Tel Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="mt_rate_tel_down" name="MT Tel Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="mt_rate_tel_neutral" name="MT Tel Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'tts' && (
            <>
              <Line type="monotone" dataKey="tts_rate_up" name="TTS Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="tts_rate_down" name="TTS Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="tts_rate_neutral" name="TTS Neutral" stroke="#ffc658" />
            </>
          )}
          {selectedCategory === 'subtl' && (
            <>
              <Line type="monotone" dataKey="subtl_up" name="Subtl Up" stroke="#8884d8" />
              <Line type="monotone" dataKey="subtl_down" name="Subtl Down" stroke="#82ca9d" />
              <Line type="monotone" dataKey="subtl_neutral" name="Subtl Neutral" stroke="#ffc658" />
            </>
          )}
          <Line type="monotone" dataKey="count" name="Total" stroke="#000000" />
        </LineChart>
      </div>
    </>
  );
};

export default Dashboard;
