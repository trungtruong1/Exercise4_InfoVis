import React, { useEffect } from 'react';
import * as d3 from 'd3';

function LineChart(props) {
    const { data, optionSelected, startDate, endDate, toggle } = props;

    useEffect(() => {
        if(toggle === false){
            drawLineChart();
        }
        }, [data, optionSelected, startDate, endDate, toggle]);

    function drawLineChart() {

        const margin = {top: 5, right: 100, bottom: 50, left: 100};
        let width = document.getElementById("graph").offsetWidth - margin.left - margin.right;
        let height = 600 - margin.top - margin.bottom;

        d3.select("#chart").select("svg").remove()
        d3.select("#legend").select("svg").remove()

        const svg = d3.select("#chart")
            .append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let countriesList = [...new Set(optionSelected.map(data => data.label))];

        let filteredData = data.filter(d => +countriesList.includes(d.location));

        filteredData = filteredData.filter(d => d3.extent([startDate, endDate])[0] <= new Date(d.date) && new Date(d.date) <= d3.extent([startDate, endDate])[1]);

        const caseLimit = d3.extent(filteredData, d => +d.total_cases);

        const xScale = d3.scaleTime()
            .domain(d3.extent([startDate, endDate]))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(caseLimit)
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        const cScale = d3.scaleOrdinal()
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

        // Draw lines
        svg.selectAll(".line")
            .data(countriesList)
            .join("path")
            .attr("fill","none")
            .attr("class", "line")
            .attr("stroke", (d, i) => cScale(d))
            .attr("stroke-width", 1)
            .attr("d", country => {
                return d3.line()
                .x(d => xScale(new Date(d.date)))
                .y(d => yScale(d.total_cases))
                (filteredData.filter(d => d.location === country));
            })
            ;

        // Line Label
        svg.selectAll(".text")     
        .data(countriesList.filter(d => filteredData.filter(covid => covid.location === d).length > 0))
        .enter()
        .append("text")
        .attr("font-family", "sans-serif")
        .attr("fill", (d, i) => cScale(d))
        .attr("dy", ".75em")
        .attr("dx", ".75em")
        .text(d => d)
        .attr("font-size", 12)
        .attr("class","label")
        .attr("x", country => {
            let arr = filteredData.filter(d => d.location === country) ;
            return xScale(new Date(arr[arr.length - 1].date));
        })
        .attr("y", country => {
            let arr = filteredData.filter(d => d.location === country) ;
            return yScale(arr[arr.length - 1].total_cases);
        });
    }
}

export default LineChart;