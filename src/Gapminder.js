import React, { useEffect } from 'react';
import * as d3 from 'd3';

function Gapminder(props) {
    const { data, selectedYear } = props;

    useEffect(() => {
        drawGapminder();
        }, [data, selectedYear]);

    function drawGapminder() {

        const margin = {top: 5, right: 30, bottom: 50, left: 150};
        let width = document.getElementById("graph").offsetWidth - margin.left - margin.right;
        let height = 600 - margin.top - margin.bottom;
        
        d3.select("#chart").select("svg").remove();
        d3.selectAll("#tooltip").remove();

        // Define the position of the chart 
        const svg = d3.select("#chart")
            .append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let filteredData = data.filter(function(item) {
            return item.year === selectedYear.toString();
          }); 

        // Create a scale for x-axis 
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width])
            .nice();

        // Create a scale for y-axis
        const yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0])
            .nice();

        // Create a scale for z-axis
        const zScale = d3.scaleLinear()
            .domain([d3.min(data, d=>+d.population), d3.max(data, d=>+d.population)])
            .range([3, 100]);

        // Define the position of each axis
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr('class', 'y-axis')
            .call(yAxis);

        // Define a scale for color 
        const cScale = d3.scaleOrdinal()
            .range(d3.schemeSet1);

        const tooltip = d3.select("#chart")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "green")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position", "absolute")
        
        const showTooltip = function(event, d) {
            tooltip
              .transition()
              .duration(200)
            tooltip
              .style("opacity", 1)
              .html(
                "Country: " + d.country +
                "<br/>Population: " + d.population +
                "<br/>Expectancy: " + d.expectancy +
                "<br/>Fertility Rate: " + d.fertility_rate)
              .style("left", (event.x) + "px")
              .style("top", (event.y)+30 + "px")
          }

        const moveTooltip = function(event, d) {
            tooltip
                .style("left", (event.x) + "px")
                .style("top", (event.y)+30 + "px")
        }

        const hideTooltip = function(event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        svg.append('g')
            .selectAll("dot")
            .data(filteredData)
            .join("circle")
                .attr("class", "bubbles")
                .attr("cx", d => xScale(+d.expectancy))
                .attr("cy", d => yScale(+d.fertility_rate))
                .attr("r", d => zScale(+d.population))
                .style("fill", d => cScale(d.country))
                .style("stroke", "black") 
                .style("stroke-width", 1)
                .style("opacity", 0.7)
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip);

        // Indicate the x-axis label 
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("font-family", "sans-serif")
            .attr("font-size", 18)
            .text("Life Expectancy");

        // Indicate the y-axis label 
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("font-family", "sans-serif")
            .attr("font-size", 18)
            .text("Fertility Rate");
    }
}

export default Gapminder;