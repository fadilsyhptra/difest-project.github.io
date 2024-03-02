const search = () => {
  var input = document.getElementById("searchInput").value.toLowerCase();
  var continents = [
    "asia",
    "africa",
    "europe",
    "north-america",
    "south-america",
    "oceania",
  ];

  continents.forEach(function (continent) {
    var format = input.replace(/\s+/g, "-");
    var cardContainer = document.getElementById(continent);

    console.log(format);

    if (continent.includes(format)) {
      cardContainer.style.display = "block";
    } else {
      cardContainer.style.display = "none";
    }
  });
};

const clearSearch = () => {
  document.getElementById("searchInput").value = "";
};
