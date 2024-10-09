const url = "https://raw.githubusercontent.com/Vishvanath0523/MAJOR-ASSIGNMENT---1/refs/heads/main/data_sample.csv";

        d3.csv(url).then(data => {
            const table_data = data.map(d => ({
                date: new Date(d.date).toISOString().slice(0, 10), // Format date as 'yyyy-mm-dd'
                EstimatedCost: +d.EstimatedCost,
                RawMaterial: Number(d.RawMaterial),
                Workmanship: Number(d.Workmanship),
                YearlyStorage: Number(d.YearlyStorage),
                ActualCost: Number(d.RawMaterial) + Number(d.Workmanship) + Number(d.YearlyStorage),
                SoldPrice: Number(d.EstimatedCost) * 1.1,
                Profit: (Number(d.EstimatedCost) * 1.1) - (Number(d.RawMaterial) + Number(d.Workmanship) + Number(d.YearlyStorage))
            }));

            const table = d3.select("body").append("table");
            const thead = table.append("thead");
            const tbody = table.append("tbody");

            const columns = ["Date", "Estimated Cost", "Raw Material Cost", "Workmanship Cost", "Yearly Storage Cost", "Actual Cost", "Sold Price", "Margin of Profit"];

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
        });