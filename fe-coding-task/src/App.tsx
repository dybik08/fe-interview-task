import React from 'react';
import './App.css';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {BarChartsWrapper, DateRangeForm} from "./modules/HouseStatistics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function App() {
  return (
      <div className="flex m-10 justify-center items-center" >
          <div className="p-10 flex flex-col justify-center items-center bg-white rounded-3xl">
              <header className="px-10">
                  <p className="py-10">
                      Norway statistics on the average price per square meter
                  </p>
              </header>
              <DateRangeForm/>
              <BarChartsWrapper/>
          </div>
      </div>
  );
}

export default App;
