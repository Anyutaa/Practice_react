import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

export function drawChart(dataArray, rowIndex) {
  const inputData = dataArray?.[rowIndex];
  if (!inputData) {
    console.error(`No data found for row index ${rowIndex}`);
    return null;
  }

  const labels = Array.from({ length: 12 }, (_, i) => 2026 + i);

  const data_set = {
    labels: labels,
    datasets: [
      {
        label: 'Данные',
        data: labels.map((year) => inputData.meanings?.[String(year)] ?? 0),
        borderColor: '#007df0',
        borderWidth: 2,
        tension: 0.3,

        pointRadius: 3, // Размер точки
        pointBorderWidth: 2, // Толщина обводки
        pointStyle: 'circle', // Форма — круг
        pointBackgroundColor: '#fff', // Центр — белый (дыра)
        pointBorderColor: '#007df0', // Обводка — как линия
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
            borderDash: [],
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
