import React, { useEffect, useState } from "react";
import axios from "axios";
import MyLineChart from "./MyLineChart";

function App() {
  const [realTimeData, setRealTimeData] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [isCelcius, setIsCelcius] = useState(false);
  const [threshold, setThreshold] = useState(1);

  const locations = {
    Delhi: { latitude: 28.7041, longitude: 77.1025 },
    Kolkata: { latitude: 22.5744, longitude: 88.3629 },
    Mumbai: { latitude: 19.076, longitude: 72.8777 },
    Chennai: { latitude: 13.0843, longitude: 80.2705 },
    Bangalore: { latitude: 12.9716, longitude: 77.5946 },
    Hyderabad: { latitude: 17.4065, longitude: 78.4772 },
  };

  async function updateRealTimeData() {
    const data = {};
    for (const city in locations) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
      );
      data[city] = response.data;
    }

    setRealTimeData(data);
  }
  function toCelcius(f) {
    return (((f - 32) * 5) / 9).toFixed();
  }
  function toFarenheit(c) {
    return ((c * 9) / 5 + 32).toFixed();
  }
  async function updateHistoricalData() {
    const data = {};
    for (const city in locations) {
      const response = await getLocationData(locations[city]);

      const cityData = calculateDailyAverageTemperature(
        response.hourly.time,
        response.hourly.temperature
      );
      data[city] = {};
      Object.entries(cityData).forEach(
        ([date, c]) => (data[city][date] = isCelcius ? c : toFarenheit(c))
      );
    }
    setHistoricalData(data);
  }

  async function getLocationData(locationData) {
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 35);
    endDate.setDate(endDate.getDate() - 3);

    startDate = startDate.toISOString().split("T")[0];
    endDate = endDate.toISOString().split("T")[0];

    const { latitude, longitude } = locationData;
    const metrics = "temperature";

    const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&hourly=${metrics}&start_date=${startDate}&end_date=${endDate}`;
    // "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41";

    const response = await axios.get(url);
    return response.data;
  }

  function calculateDailyAverageTemperature(dates, temperatures) {
    const dailyTemps = {};

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i].split("T")[0]; // Extract the date part
      if (!dailyTemps[date]) {
        dailyTemps[date] = []; // Initialize an array for each date
      }
      dailyTemps[date].push(temperatures[i]); // Add the temperature to the corresponding date
    }

    // Calculate the average for each date
    const dailyAverage = {};
    for (const date in dailyTemps) {
      const sum = dailyTemps[date].reduce((acc, curr) => acc + curr, 0);
      const average = sum / dailyTemps[date].length;
      dailyAverage[date] = parseFloat(average.toFixed(2)); // Round to 2 decimal places
    }

    return dailyAverage;
  }
  useEffect(() => {
    updateRealTimeData();
    updateHistoricalData();
    setInterval(updateRealTimeData, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    console.log("updated Real Time Data:", realTimeData);
  }, [realTimeData]);

  useEffect(() => {
    console.log("updated Historical Data:", historicalData);
  }, [historicalData]);

  useEffect(() => {
    const newData = {};
    for (const city in historicalData) {
      newData[city] = {};
      Object.entries(historicalData[city]).forEach(
        ([date, c]) =>
          (newData[city][date] = isCelcius ? toCelcius(c) : toFarenheit(c))
      );
    }
    setHistoricalData(newData);
  }, [isCelcius]);

  useEffect(() => {
    console.log("updated Real Time Data:", realTimeData);
  }, [realTimeData]);

  return (
    <div className="app">
      <div className="search">
        <div>
        <label> in Celcius: </label>
        <input
          type="checkbox"
          checked={isCelcius}
          title="somethn"
          onChange={(e) => setIsCelcius(!isCelcius)}
        />
        </div>
        <div>
        <label>Set Deviation Threshold: </label>
        <input
          id="threshold"
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          min="0"
          step="1"
        />
        </div>
      </div>
      {Object.entries(realTimeData).map(([city, data], index) => {
        return (
          <div className="city" key={index}>
            <div className="container">
              <div className="weather-card">
                <div className="location">
                  <p>{data.name}</p>
                </div>
                <div className="temp">
                  {data.main ? (
                    <h3>
                      {isCelcius
                        ? toCelcius(data.main.temp.toFixed())
                        : data.main.temp.toFixed()}
                      {isCelcius ? "°C" : "°F"}
                    </h3>
                  ) : null}
                </div>
                <div className="description">
                  {data.weather ? <p>{data.weather[0].main}</p> : null}
                </div>
              </div>

              {data.name !== undefined && (
                <div className="details">
                  <div className="feels">
                    {data.main ? (
                      <p className="bold">
                        {isCelcius
                          ? toCelcius(data.main.temp_min)
                          : data.main.temp_min}
                        {isCelcius ? "°C" : "°F"}
                      </p>
                    ) : null}
                    <p>Min_temp</p>
                  </div>
                  <div className="details">
                    {data.main ? (
                      <p className="bold">{isCelcius
                        ? toCelcius(data.main.temp_max)
                      : data.main.temp_max}
                      {isCelcius ? "°C" : "°F"}</p>
                    ) : null}
                    <p>Max Temp</p>
                  </div>
                  <div className="details">
                    {data.wind ? (
                      <p className="bold">{isCelcius
                        ? toCelcius(((data.main.temp_min +data.main.temp_max +data.main.temp + data.main.feels_like)/4).toFixed(2))
                        : ((data.main.temp_min +data.main.temp_max +data.main.temp + data.main.feels_like)/4).toFixed(2)}
                        {isCelcius ? "°C" : "°F"}
                         </p>
                    ) : null}
                    <p>Average Temp</p>
                  </div>
                </div>
              )}
            </div>
            <div className="line-chart">
              <MyLineChart
                dataInput={historicalData[city] ?? []}
                deviationThreshold={threshold}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
