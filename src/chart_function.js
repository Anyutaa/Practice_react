import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

export function drawChart(dataArray, rowId, yearLabels) {
  const inputData = dataArray?.find((item) => item.id === rowId);
  if (!inputData) {
    console.error(`No data found for row id ${rowId}`);
    return null;
  }

  const labels = yearLabels.map((y) => y.id);

  const data_set = {
    labels: labels,
    datasets: [
      {
        label: 'Данные',
        data: labels.map((year) => inputData.meanings?.[String(year)] ?? 0),
        borderColor: '#007df0',
        borderWidth: 2,
        tension: 0.3,

        pointRadius: 3,
        pointBorderWidth: 2,
        pointStyle: 'circle',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#007df0',
      },
    ],
  };

  const config = {
    type: 'line',
    data: data_set,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 14,
              family: 'Roboto',
            },
          },
          grid: {
            color: '#D0D0D0',
          },
          border: {
            dash: [5, 5],
          },
        },
        y: {
          ticks: {
            font: {
              size: 14,
              family: 'Roboto',
            },
          },
          grid: {
            color: '#D0D0D0',
          },
          border: {
            dash: [5, 5],
          },
        },
      },
    },
  };

  const ctx = document.getElementById('myChart')?.getContext('2d');
  if (!ctx) {
    console.error("Canvas element with id 'myChart' not found.");
    return null;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, config);
  return chartInstance;
}
