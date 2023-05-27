import React from "react";
import './App.css';
import BarChart from './BarChart'
import Select from "./Select.js";
import LineChart from './LineChart'
import * as d3 from 'd3'
import csvData from './data/owid-covid-data.csv'
import { useEffect, useState } from 'react';
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated();

function App() {
  const [data, setData] = useState([]);
  const [vaccinatedData, setVaccinatedData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [optionSelected, setOptionSelected] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2020-02-24'));
  const [endDate, setEndDate] = useState(new Date('2023-02-27'));
  const [toggle, setToggle] = useState(false);
  
  useEffect(() => {
    d3.csv(csvData)
    .then(data => {
          data.map(function(el){
              el["percent_fully"] = el["people_fully_vaccinated"] / el["population"];
              el["total_percent"] = el["people_vaccinated"] / el["population"];
              el["percent_partly"] = el["total_percent"] - el["percent_fully"];
          });
          const share = data.filter(el => el.people_vaccinated & el.people_fully_vaccinated)
  
          const getRecent = arr => { 
              const res = [], map = {};
           
              arr.forEach(el => {
                 if (!(el['location'] in map)) {
                    map[el['location']] = res.push(el) - 1;
                    return;
                 };
                 if(res[map[el['location']]]['date'] < el['date']){
                    res[map[el['location']]] = el;
                 };
              });
              return res;
          };
  
          const vaccinated = getRecent(share);
          vaccinated.sort(function(a, b){
              return b["total_percent"] - a["total_percent"]
          })

          const countryNames = [...new Set(data.map(data => data.location))];
          setData(data)
          setVaccinatedData(vaccinated)
          setCountryData(countryNames)
  
    })
     .catch(error => {
          console.error(error);
          console.error('Error loading the data');
  });
  }, []);

  const countryMap = countryData.map((value) => ({
    value: value,
    label: value,
  }));

  return (
    <div className="App">
      <div id="container" className="flexbox">
        <div id="graph" className="flexbox3">
          <center>
            <h3>InfoVis Exercise 3</h3>
            <div id="legend"></div>
            <div id="chart" >
              <BarChart 
                toggle={toggle}
                data={vaccinatedData.filter(el => el.total_percent <= 1)}
                optionSelected={optionSelected}/>
              <LineChart 
                toggle={toggle}
                data={data}
                startDate={startDate}
                endDate={endDate}
                optionSelected={optionSelected}/>
            </div>
          </center>
        </div>
        <div className="flexbox2" >
          <center>
            <h3>Pick countries to display!</h3>
            <Select
              options={countryMap}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={({ Option, MultiValue, animatedComponents })}
              onChange={(selected) => {setOptionSelected(selected)}}
              allowSelectAll={true}
              value={optionSelected}
            />
          </center>   
          <center>
            <h3>Pick start date!</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker onChange={(date) => setStartDate(new Date(date))}/>
            </LocalizationProvider>
          </center> 
          <center>
            <h3>Pick end date!</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker onChange={(date) => {
                if(new Date(date) > startDate){
                  setEndDate(new Date(date))
                }
                else{
                  console.log("End date has to be after start date!")
                }
                }}/>
            </LocalizationProvider>
          </center> 
          <center>
            <h3>Turn on the switch to see the Bar Chart, off to see the Line Chart!</h3>
            <FormGroup>
              <center>
              <FormControlLabel control={<Switch onChange={(event) => {
                if(event.target.checked === true){
                  setToggle(true)
                } else {
                  setToggle(false)
                }
              }} />} />
              </center>
            </FormGroup>
          </center>
        </div>
      </div>
    </div>
  );
}

export default App;
