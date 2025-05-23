const url = "https://raw.githubusercontent.com/Vishvanath0523/MAJOR-ASSIGNMENT---1/refs/heads/main/data_sample.csv";

d3.csv(url).then(data => {
  const table_data = data.map(d => {
    // Calculate ActualCost
    const ActualCost = parseFloat(Number(d.RawMaterial) + Number(d.Workmanship) + Number(d.StorageCost)) || 0;

    // Calculate SoldPrice
    const SoldPrice = parseFloat((Number(d.EstimatedCost) * 1.1).toFixed(2)) || 0; // Ensure SoldPrice is valid

    // Calculate Profit
    const Profit = parseFloat(SoldPrice - ActualCost).toFixed(2); // Calculate Profit

    return {
      date: new Date(d.date).toISOString().slice(0, 10), // Format date as 'yyyy-mm-dd'
      EstimatedCost: +d.EstimatedCost,
      RawMaterial: Number(d.RawMaterial),
      Workmanship: Number(d.Workmanship),
      StorageCost: Number(d.StorageCost),
      ActualCost: ActualCost, // Use the calculated ActualCost
      SoldPrice: SoldPrice, // Use the calculated SoldPrice
      Profit: Profit >= 0 ? Profit : 0 // Ensure Profit is not NaN, set to 0 if negative
    };
  });

  const table = d3.select("body").append("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  const columns = ["Date", "Estimated Cost", "Raw Material Cost", "Workmanship Cost", "Storage Cost", "Actual Cost", "Sold Price", "Margin Of Profit"];

  // Add table header
  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(d => d);

  // Add table rows
  const rows = tbody.selectAll("tr")
    .data(table_data)
    .enter()
    .append("tr");

  // Populate the table cells
  rows.selectAll("td")
    .data(d => Object.values(d))
    .enter()
    .append("td")
    .text(d => d);

  table.node().appendChild(thead.node());
  table.node().appendChild(tbody.node());
  table.insert("caption").text("Supply Chain Data");

  // Create Line Chart for EstimatedCost, ActualCost, SoldPrice

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up the scales
  const x = d3.scaleTime()
    .domain(d3.extent(table_data, d => new Date(d.date)))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(table_data, d => Math.max(d.EstimatedCost, d.ActualCost, d.SoldPrice))])
    .range([height, 0]);

  // Create axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Line generators for each cost category
  const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.EstimatedCost));

  const lineActual = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.ActualCost));

  const lineSold = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.SoldPrice));

  const Profit = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.Profit));

  // Draw EstimatedCost line
  svg.append("path")
    .datum(table_data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Draw ActualCost line
  svg.append("path")
    .datum(table_data)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", lineActual);

  // Draw SoldPrice line
  svg.append("path")
    .datum(table_data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", lineSold);

  // Draw Profit line
  svg.append("path")
    .datum(table_data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", Profit);

  // Add legend
  const legend = svg.selectAll(".legend")
    .data(["Estimated Cost", "Actual Cost", "Sold Price", "Margin of Profit"])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => ["steelblue", "green", "red", "orange"][i]);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
});