import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useListHouseStatistics} from './modules/api/HouseStatistics.controller'
import {DateRange, DateRangeApiFormat, HouseType} from "./modules/api/HouseStatistics.api";

class DateRangeMapper {
  static mapDateRangeToQuarterList(dateRange: DateRange): DateRangeApiFormat {
    // starting year, starting quater, fill with quaters to end year, end quater
    const startingYear = dateRange.from.year
    const endingYear = dateRange.to.year
    const startingQuarter = dateRange.from.quarter
    const endingQuarter = dateRange.to.quarter
    
    const result = []
    
    const pickEndingQuarter = (year: number) => {
      if(year === endingYear) {
        return endingQuarter
      }
      
      return 4
    }
    
    for (let year = startingYear; year <= endingYear; year++) {
      for (let quarter = startingQuarter; quarter <= pickEndingQuarter(year); quarter++) {
        const correctFormat = `${year}K${quarter}`;
        result.push(correctFormat)
      }
    }
    
    return result
  }
}

function App() {
  const dateRange = DateRangeMapper.mapDateRangeToQuarterList({
    from: {
      year: 2020,
      quarter: 1
    },
    to: {
      year: 2022,
      quarter: 2
    },
  })
  console.log({ dateRange });
  const {error, loading, houseStatistics} = useListHouseStatistics([HouseType.Smahus], dateRange )
  console.log("houseStatistics: ", houseStatistics)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
