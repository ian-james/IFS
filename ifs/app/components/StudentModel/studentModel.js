

function updateChart( chartName, charData ) {
    var ctx = document.getElementById(chartName).getContext("2d");
    var newChart = new Chart(ctx, chartData);
}
