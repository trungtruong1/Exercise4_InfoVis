import * as React from 'react';
import './App.css';
import Gapminder from "./Gapminder";
import * as d3 from 'd3'
import csvFer from './data/fertility-rate.csv'
import csvExp from './data/life-expectancy.csv'
import csvPop from './data/population.csv'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState([1960]);
  
  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  const marks = [
    {
      value: 1960,
      label: "1960"
    },
    {
      value: 2021,
      label: "2021"
    }
  ];

  let years = [];

  for (let i = 1960; i < 2023; i++) {
    years.push(i.toString());
  }

  useEffect(() => {
    Promise.all([
      d3.csv(csvFer),
      d3.csv(csvExp),
      d3.csv(csvPop),
      ]).then(function(files) {
          let ferData = files[0];
          let expData = files[1];
          let popData = files[2];
          let processedData = [];
          years.forEach(year => {
            for(let i = 0; i < ferData.length; i++){             
              let country_data_for_a_year = {
                'year': year,
                'country': ferData[i]["Country Name"],
                'fertility_rate': ferData[i][year],
                'population': popData[i][year],
                'expectancy': expData[i][year],
              };
              processedData.push(country_data_for_a_year);
            }
          });

          let nonNullProcessedData = processedData.filter(function(item) {
            return item.fertility_rate != "" && item.population != "" && item.expectancy != "";
          });
          
          nonNullProcessedData.sort(function(a, b){
            return b["population"] - a["population"]
          })

          setData(nonNullProcessedData);
      }).catch(function(error) {
          console.error(error);
          console.error('Error loading the data');
      })
  }, [])

  return (
    <div className="App">
      <div id="container" className="flexbox">
        <div id="graph" className="flexbox3">
          <center>
            <h3>InfoVis Exercise 4</h3>
            <div id="legend"></div>
            <div id="chart" >
              <Gapminder
                data={data}
                selectedYear={selectedYear}
              />
            </div>
          </center>
        </div>
        <div className="flexbox2">
          <Box sx={{ height: 500 }}>
            <Slider
              sx={{
                '& input[type="range"]': {
                  WebkitAppearance: 'slider-vertical',
                },
              }}
              orientation="vertical"
              onChange={(selected) => {setSelectedYear(selected.target.value)}}
              defaultValue={1960}
              valueLabelDisplay="on"
              onKeyDown={preventHorizontalKeyboardNavigation}
              marks={marks}
              step={1}
              min={1960}
              max={2021}
            />
          </Box>
        </div>
      </div>
    </div>
  );
}

export default App;
