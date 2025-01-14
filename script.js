document.addEventListener("DOMContentLoaded", function () {
  const createCharacterButton = document.getElementById("createCharacter");
  const characterCardContainer = document.getElementById(
    "characterCardContainer"
  );

  createCharacterButton.addEventListener("click", function () {
    const characterName = document.getElementById("characterName").value.trim();
    if (characterName) {
      generateCharacterCard(characterName);
    } else {
      alert("Por favor, ingrese un nombre para el personaje.");
    }
  });

  function generateCharacterCard(name) {
    const card = document.createElement("div");
    card.classList.add("character-card");

    const title = document.createElement("h2");
    title.textContent = name;

    const village = document.createElement("p");
    village.innerHTML = `<strong>Aldea:</strong> ${getRandomVillage()}`;

    const rank = document.createElement("p");
    rank.innerHTML = `<strong>Rango Ninja:</strong> ${getRandomRank()}`;

    const affiliation = document.createElement("p");
    affiliation.innerHTML = `<strong>Afiliación:</strong> ${getRandomAffiliation()}`;

    const chakraNature = document.createElement("p");
    chakraNature.innerHTML = `<strong>Naturaleza de Chakra:</strong> ${getRandomChakraNature()}`;

    const taijutsuBar = createProgressBar("Taijutsu", getRandomStat());
    const ninjutsuBar = createProgressBar("Ninjutsu", getRandomStat());
    const genjutsuBar = createProgressBar("Genjutsu", getRandomStat());
    const chakraAmountBar = createProgressBar(
      "Cantidad de Chakra",
      getRandomStat()
    );
    const chakraControlBar = createProgressBar(
      "Manejo del Chakra",
      getRandomStat()
    );

    card.appendChild(title);
    card.appendChild(village);
    card.appendChild(rank);
    card.appendChild(affiliation);
    card.appendChild(chakraNature);
    card.appendChild(taijutsuBar);
    card.appendChild(ninjutsuBar);
    card.appendChild(genjutsuBar);
    card.appendChild(chakraAmountBar);
    card.appendChild(chakraControlBar);

    const downloadButton = document.createElement("button");
    downloadButton.classList.add("download-button");
    downloadButton.textContent = "Descargar";
    downloadButton.addEventListener("click", () => downloadCard(card));
    card.appendChild(downloadButton);

    characterCardContainer.appendChild(card);
  }

  function createProgressBar(label, value) {
    const container = document.createElement("div");
    container.classList.add("bar-container");

    const labelElement = document.createElement("span");
    labelElement.classList.add("bar-label");
    labelElement.textContent = label;

    const bar = document.createElement("div");
    bar.classList.add("bar");

    const barFill = document.createElement("div");
    barFill.classList.add("bar-fill");
    barFill.style.width = `${value}%`;

    bar.appendChild(barFill);
    container.appendChild(labelElement);
    container.appendChild(bar);

    return container;
  }

  function getRandomVillage() {
    const villages = [
      "Konoha",
      "Sunagakure",
      "Kirigakure",
      "Iwagakure",
      "Kumogakure",
    ];
    return villages[Math.floor(Math.random() * villages.length)];
  }

  function getRandomRank() {
    const ranks = ["Genin", "Chunin", "Jonin", "Anbu", "Sannin"];
    return ranks[Math.floor(Math.random() * ranks.length)];
  }

  function getRandomAffiliation() {
    const affiliations = [
      "Anbu",
      "Anbu Raiz",
      "Akatsuki",
      "Ninja Desertor",
      "Independiente",
    ];
    return affiliations[Math.floor(Math.random() * affiliations.length)];
  }

  function getRandomChakraNature() {
    const natures = [
      "Fuego",
      "Agua",
      "Rayo",
      "Tierra",
      "Viento",
      "Madera",
      "Hielo",
      "Lava",
      "Hierro",
    ];
    return getRandomArrayElements(
      natures,
      Math.floor(Math.random() * 2) + 1
    ).join(", ");
  }

  function getRandomStat() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  function downloadCard(card) {
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${card.querySelector("h2").textContent}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }
});
