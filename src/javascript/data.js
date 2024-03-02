document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndDrawCharts();
});

async function fetchDataAndDrawCharts() {
  try {
    const response = await fetch("../data/earthquake_dataset.json");
    const data = await response.json();
    drawEarthquakeChart(data);
    drawBiggestEarthquakesChart(data);
    drawBiggestEarthquakesChartContinent(data);
  } catch (error) {
    console.error("An error occurred while fetching earthquake data:", error);
  }
}

const drawEarthquakeChart = (data) => {
  const continentCounts = data.reduce((acc, earthquake) => {
    const continent = earthquake.Continent;
    acc[continent] = (acc[continent] || 0) + 1;
    return acc;
  }, {});

  const totalEarthquakes = Object.values(continentCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  const labels = Object.keys(continentCounts);
  const dataValues = Object.values(continentCounts).map((count) =>
    ((count / totalEarthquakes) * 100).toFixed(2)
  );

  const ctx = document.getElementById("earthquakeChart").getContext("2d");
  const radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Percentage of Earthquakes by Continent",
          data: dataValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(102, 255, 204, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(102, 255, 204, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              label += context.formattedValue + "%";
              return label;
            },
          },
        },
      },
    },
  });
};


const drawBiggestEarthquakesChart = (data) => {
  const sortedData = data.slice().sort((a, b) => b.Magnitude - a.Magnitude);
  const topTen = sortedData.slice(0, 10);

  const labels = topTen.map(
    (earthquake) =>
      `${earthquake.Place}, ${earthquake.Country} (${earthquake.Latitude}, ${earthquake.Longitude})`
  );
  const magnitudes = topTen.map((earthquake) => earthquake.Magnitude);

  const ctx = document
    .getElementById("biggestEarthquakesChart")
    .getContext("2d");
  const barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Magnitude",
          data: magnitudes,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
      scales: {
        x: {
          display: false,
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              label +=
                context.parsed.y +
                " (Lat: " +
                topTen[context.dataIndex].Latitude +
                ", Long: " +
                topTen[context.dataIndex].Longitude +
                ")";
              return label;
            },
          },
        },
      },
    },
  });
};

const drawBiggestEarthquakesChartContinent = (data) => {
  drawBarChart(
    "Asia",
    data.filter((earthquake) => earthquake.Continent === "Asia")
  );
  drawBarChart(
    "Africa",
    data.filter((earthquake) => earthquake.Continent === "Africa")
  );
  drawBarChart(
    "Europe",
    data.filter((earthquake) => earthquake.Continent === "Europe")
  );
  drawBarChart(
    "North America",
    data.filter((earthquake) => earthquake.Continent === "North America")
  );
  drawBarChart(
    "South America",
    data.filter((earthquake) => earthquake.Continent === "South America")
  );
  drawBarChart(
    "Oceania",
    data.filter((earthquake) => earthquake.Continent === "Oceania")
  );
};

const drawBarChart = (continent, continentData) => {
  const sortedData = continentData
    .slice()
    .sort((a, b) => b.Magnitude - a.Magnitude);
  const topTen = sortedData.slice(0, 10);

  const labels = topTen.map(
    (earthquake) =>
      `${earthquake.Place}, ${earthquake.Country} (${earthquake.Latitude}, ${earthquake.Longitude})`
  );
  const magnitudes = topTen.map((earthquake) => earthquake.Magnitude);

  const ctx = document
    .getElementById(`${continent.toLowerCase()}EarthquakeChart`)
    .getContext("2d");
  const barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Magnitude",
          data: magnitudes,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
      scales: {
        x: {
          display: false,
          title: {
            display: false,
            text: "Location",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Magnitude",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              label +=
                context.parsed.y +
                " (Lat: " +
                topTen[context.dataIndex].Latitude +
                ", Long: " +
                topTen[context.dataIndex].Longitude +
                ")";
              return label;
            },
          },
        },
      },
    },
  });
};

