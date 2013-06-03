var renderCharts = function(data) {
  var svg = d3.select("body").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "bullet")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = svg.append("g")
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + height / 2 + ")");

  title.append("text")
      .attr("class", "title")
      .text(function(d) { return d.title; });

  title.append("text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.subtitle; });

  // socket.on('newData', function(data) {
  //   svg.data(parseQueens(data)).call(chart.duration(50));
  // });
}

var parseQueens = function(data) {
  var newData = chartData;
  newData.forEach(function(row, index) {
      row['measures'][0] = data.lengths[index + 2];
  });
  return newData;
}

var chartDataInit = function(n) {
  var chartData = [], 
      row;

  for (var i = 2; i <=n; i++) {
    row = {
      title: "Row " + i,
      subtitle: (i-1) + " Queens placed",
      ranges: [0,n/2, n],
      measures: [0],
      markers: [0]
    }
    chartData.push(row);
  }
  return chartData;
};