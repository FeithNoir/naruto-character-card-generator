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
    card.classList.add( "w-80", "mx-auto", "my-5", "p-5", "bg-white", "border", "border-gray-300", "rounded-lg", "shadow-lg", "relative" );

    const title = document.createElement("h2");
    title.textContent = name;
    title.classList.add("text-2xl", "font-bold", "text-gray-800", "mb-4");

    const village = document.createElement("p");
    village.innerHTML = `<strong>Aldea:</strong> ${getRandomVillage()}`;
    village.classList.add("my-1", "text-gray-600");

    const rank = document.createElement("p");
    rank.innerHTML = `<strong>Rango Ninja:</strong> ${getRandomRank()}`;
    rank.classList.add("my-1", "text-gray-600");

    const affiliation = document.createElement("p");
    affiliation.innerHTML = `<strong>Afiliación:</strong> ${getRandomAffiliation()}`;
    affiliation.classList.add("my-1", "text-gray-600");

    const chakraNature = document.createElement("p");
    chakraNature.innerHTML = `<strong>Naturaleza de Chakra:</strong> ${getRandomChakraNature()}`;
    chakraNature.classList.add("my-1", "text-gray-600");

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
    downloadButton.classList.add( "absolute", "top-2", "right-2", "py-1", "px-2", "text-white", "border-none", "rounded-md", "cursor-pointer", "transition-colors", "duration-300", "ease-in-out");
    downloadButton.textContent = "Descargar";
    downloadButton.addEventListener("click", () => downloadCard(card));
    card.appendChild(downloadButton);

    characterCardContainer.appendChild(card);
  }

  function createProgressBar(label, value) {
    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "my-2");

    const labelElement = document.createElement("span");
    labelElement.classList.add("w-40");
    labelElement.textContent = label;

    const bar = document.createElement("div");
    bar.classList.add( "flex-grow", "h-4", "bg-gray-300", "rounded-md", "overflow-hidden");

    const barFill = document.createElement("div");
    barFill.classList.add("h-full");
    barFill.style.width = `${value}%`;

    // Determina el color basada en el valor
    if (value <= 33) {
      barFill.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--low-skill-color');
    } else if (value <= 66) {
      barFill.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--medium-skill-color');
    } else {
      barFill.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--high-skill-color');
    }

    bar.appendChild(barFill);
    container.appendChild(labelElement);
    container.appendChild(bar);

    return container;
  }

  function getRandomVillage() {
    const villages = [
      "Konohagakure",
      "Sunagakure",
      "Kirigakure",
      "Iwagakure",
      "Kumogakure",
      "Amegakure",
      "Otogakure",
      "Hoshigakure",
      "Takigakure",
      "Yugakure",
    ];
    return villages[Math.floor(Math.random() * villages.length)];
  }

  function getRandomRank() {
    const ranks = ["Genin", "Chunin", "Jonin", "Anbu", "Sannin", "Kage", "Espadachín de la niebla", "Ninja Médico"];
    return ranks[Math.floor(Math.random() * ranks.length)];
  }

  function getRandomAffiliation() {
    const affiliations = [
      "Raiz",
      "Akatsuki",
      "Ninja Desertor",
      "Instructor",
      "Guardia",
      "Patrulla",
      "Reconocimiento",
      "Rastreador",
      "Cazador",
      "Mercenario",
      "Equipo de Sellado",
      "Fuerzas Aliadas Shinobi",
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
      "Polvo",
      "Vapor",
      "Cristal",
      "Oscuridad",
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
