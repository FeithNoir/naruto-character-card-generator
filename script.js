document.addEventListener("DOMContentLoaded", function () {
  const startScreen = document.getElementById("start-screen");
  const newGameButton = document.getElementById("new-game-button");
  const loadGameButton = document.getElementById("load-game-button");
  const mainAppContainer = document.getElementById("main-app-container");
  const sidebar = document.getElementById("sidebar");

  const createCharacterButton = document.getElementById("createCharacter");
  const characterCardContainer = document.getElementById(
    "characterCardContainer"
  );
  const characterGallery = document.getElementById("characterGallery");
  const cardBackgroundColorInput = document.getElementById("cardBackgroundColor");
  const cardFontSelect = document.getElementById("cardFont");
  const generateTeamButton = document.getElementById("generateTeam");
  const teamContainer = document.getElementById("teamContainer");
  const character1Select = document.getElementById("character1Select");
  const character2Select = document.getElementById("character2Select");
  const startBattleButton = document.getElementById("startBattleButton");
  const battleLog = document.getElementById("battleLog");
  const saveAllDataButton = document.getElementById("save-data-button");
  const characterImageInput = document.getElementById("characterImage");
  const statInputs = document.querySelectorAll(".stat-input");
  const USER_ASSIGNABLE_POINTS = 10;
  let savedCharacters = []; // Global array to hold all saved characters
  let initialRandomStats = {}; // To store the randomly assigned 90 points

  function generateUid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function updateRemainingPoints() {
    const remainingPointsSpan = document.getElementById("remainingPoints");
    const taijutsuPoints = parseInt(document.getElementById("taijutsuPoints").value) || 0;
    const ninjutsuPoints = parseInt(document.getElementById("ninjutsuPoints").value) || 0;
    const genjutsuPoints = parseInt(document.getElementById("genjutsuPoints").value) || 0;
    const chakraAmountPoints = parseInt(document.getElementById("chakraAmountPoints").value) || 0;
    const chakraControlPoints = parseInt(document.getElementById("chakraControlPoints").value) || 0;

    const totalAssignedPoints = taijutsuPoints + ninjutsuPoints + genjutsuPoints + chakraAmountPoints + chakraControlPoints;
    const remaining = USER_ASSIGNABLE_POINTS - (totalAssignedPoints - (initialRandomStats.taijutsu + initialRandomStats.ninjutsu + initialRandomStats.genjutsu + initialRandomStats.chakraAmount + initialRandomStats.chakraControl));

    remainingPointsSpan.textContent = USER_ASSIGNABLE_POINTS;

    if (remaining < 0) {
      remainingPointsSpan.style.color = "red";
    } else {
      remainingPointsSpan.style.color = "black";
    }
  }

  let currentUser = {
    uid: localStorage.getItem("userUid") || generateUid(),
    username: localStorage.getItem("username") || "user"
  };

  localStorage.setItem("userUid", currentUser.uid);
  localStorage.setItem("username", currentUser.username);

  // Initial check for saved data
  if (localStorage.getItem("ninjaCharacters")) {
    savedCharacters = JSON.parse(localStorage.getItem("ninjaCharacters"));
    loadGameButton.classList.remove("hidden");
  }

  newGameButton.addEventListener("click", () => {
    localStorage.removeItem("ninjaCharacters"); // Clear any existing saved data for a new game
    startGame();
  });

  loadGameButton.addEventListener("click", () => {
    startGame(true);
  });

  function showView(viewId) {
    document.querySelectorAll(".view-section").forEach((view) => {
      view.classList.add("hidden");
    });
    document.getElementById(viewId).classList.remove("hidden");
  }

  document.querySelectorAll(".sidebar-button").forEach((button) => {
    button.addEventListener("click", function () {
      showView(this.dataset.view);
    });
  });

  function startGame(load = false) {
    startScreen.classList.add("hidden");
    mainAppContainer.classList.remove("hidden");
    sidebar.classList.remove("hidden");
    if (load) {
      loadCharacters();
    }
    showView("create-character-view"); // Default view
    updateRemainingPoints(); // Initialize remaining points display

    // Move event listeners here to ensure elements are in DOM
    createCharacterButton.addEventListener("click", function () {
      const characterName = document.getElementById("characterName").value.trim();
      const characterAuthor = currentUser.uid; // Automatically assign user UID as author

      if (characterName) {
        let userAddedPoints = 0;
        statInputs.forEach(input => {
          const statName = input.id.replace("Points", "");
          userAddedPoints += (parseInt(input.value) || 0) - initialRandomStats[statName];
        });

        if (userAddedPoints > USER_ASSIGNABLE_POINTS) {
          alert(`No puedes asignar más de ${USER_ASSIGNABLE_POINTS} puntos adicionales.`);
          return;
        }

        const finalStats = {
          taijutsu: parseInt(document.getElementById("taijutsuPoints").value),
          ninjutsu: parseInt(document.getElementById("ninjutsuPoints").value),
          genjutsu: parseInt(document.getElementById("genjutsuPoints").value),
          chakraAmount: parseInt(document.getElementById("chakraAmountPoints").value),
          chakraControl: parseInt(document.getElementById("chakraControlPoints").value),
        };
        const imageUrl = characterImageInput.dataset.imageDataUrl || null;
        generateCharacterCard(characterName, finalStats, imageUrl, null, characterAuthor);
      } else {
        alert("Por favor, ingrese un nombre para el personaje.");
      }
    });

    statInputs.forEach(input => {
      input.addEventListener("input", updateRemainingPoints);
    });

    characterImageInput.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          characterImageInput.dataset.imageDataUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    cardBackgroundColorInput.addEventListener("input", function() {
      document.documentElement.style.setProperty('--card-background-color', this.value);
    });

    cardFontSelect.addEventListener("change", function() {
      document.documentElement.style.setProperty('--card-font-family', this.value);
    });

    generateTeamButton.addEventListener("click", generateTeam);
    startBattleButton.addEventListener("click", startBattle);
    saveAllDataButton.addEventListener("click", saveAllCharacters);
  }

  

  function showView(viewId) {
    document.querySelectorAll(".view-section").forEach((view) => {
      view.classList.add("hidden");
    });
    document.getElementById(viewId).classList.remove("hidden");
  }

  document.querySelectorAll(".sidebar-button").forEach((button) => {
    button.addEventListener("click", function () {
      showView(this.dataset.view);
    });
  });

  function generateCharacterCard(name, customStats, imageUrl, existingCharacterData, author) {
    const card = document.createElement("div");
    card.classList.add( "w-80", "mx-auto", "my-5", "p-5", "bg-white", "border", "border-gray-300", "rounded-lg", "shadow-lg", "relative" );
    card.style.backgroundColor = "var(--card-background-color)";
    card.style.fontFamily = "var(--card-font-family)";

    if (imageUrl) {
      const characterImage = document.createElement("img");
      characterImage.src = imageUrl;
      characterImage.classList.add("w-32", "h-32", "rounded-full", "mx-auto", "mb-4", "object-cover");
      card.appendChild(characterImage);
    }

    const title = document.createElement("h2");
    title.textContent = name;
    title.classList.add("text-2xl", "font-bold", "text-gray-800", "mb-4");

    const authorElement = document.createElement("p");
    authorElement.innerHTML = `<strong>Autor:</strong> ${author || 'Desconocido'}`;
    authorElement.classList.add("my-1", "text-gray-600");

    const village = document.createElement("p");
    village.innerHTML = `<strong>Aldea:</strong> ${existingCharacterData ? existingCharacterData.village : getRandomVillage()}`;
    village.classList.add("my-1", "text-gray-600");

    const rank = document.createElement("p");
    rank.innerHTML = `<strong>Rango Ninja:</strong> ${existingCharacterData ? existingCharacterData.rank : getRandomRank()}`;
    rank.classList.add("my-1", "text-gray-600");

    const affiliation = document.createElement("p");
    affiliation.innerHTML = `<strong>Afiliación:</strong> ${existingCharacterData ? existingCharacterData.affiliation : getRandomAffiliation()}`;
    affiliation.classList.add("my-1", "text-gray-600");

    const chakraNature = document.createElement("p");
    const chakraNatureText = existingCharacterData ? existingCharacterData.chakraNature : getRandomChakraNature();
    chakraNature.innerHTML = `<strong>Naturaleza de Chakra:</strong> ${chakraNatureText}`;
    chakraNature.classList.add("my-1", "text-gray-600");

    const jutsus = document.createElement("p");
    const experience = existingCharacterData ? existingCharacterData.experience : 0;
    const level = calculateLevel(experience).level;
    const attributePoints = existingCharacterData ? existingCharacterData.attributePoints : calculateLevel(experience).attributePoints;

    jutsus.innerHTML = `<strong>Jutsus:</strong> ${existingCharacterData ? existingCharacterData.jutsus : generateRandomJutsus(chakraNatureText, level)}`;
    jutsus.classList.add("my-1", "text-gray-600");

    const baseTaijutsu = getRandomStat();
    const baseNinjutsu = getRandomStat();
    const baseGenjutsu = getRandomStat();
    const baseChakraAmount = getRandomStat();
    const baseChakraControl = getRandomStat();

    const finalTaijutsu = existingCharacterData ? existingCharacterData.stats.taijutsu : (baseTaijutsu + (customStats ? customStats.taijutsu : 0));
    const finalNinjutsu = existingCharacterData ? existingCharacterData.stats.ninjutsu : (baseNinjutsu + (customStats ? customStats.ninjutsu : 0));
    const finalGenjutsu = existingCharacterData ? existingCharacterData.stats.genjutsu : (baseGenjutsu + (customStats ? customStats.genjutsu : 0));
    const finalChakraAmount = existingCharacterData ? existingCharacterData.stats.chakraAmount : (baseChakraAmount + (customStats ? customStats.chakraAmount : 0));
    const finalChakraControl = existingCharacterData ? existingCharacterData.stats.chakraControl : (baseChakraControl + (customStats ? customStats.chakraControl : 0));

    const taijutsuBar = createProgressBar("Taijutsu", finalTaijutsu);
    const ninjutsuBar = createProgressBar("Ninjutsu", finalNinjutsu);
    const genjutsuBar = createProgressBar("Genjutsu", finalGenjutsu);
    const chakraAmountBar = createProgressBar(
      "Cantidad de Chakra",
      finalChakraAmount
    );
    const chakraControlBar = createProgressBar(
      "Manejo del Chakra",
      finalChakraControl
    );

    const characterData = {
      name: name,
      author: author || 'Desconocido',
      village: village.textContent.replace('Aldea: ', ''),
      rank: rank.textContent.replace('Rango Ninja: ', ''),
      affiliation: affiliation.textContent.replace('Afiliación: ', ''),
      chakraNature: chakraNature.textContent.replace('Naturaleza de Chakra: ', ''),
      jutsus: jutsus.textContent.replace('Jutsus: ', ''),
      stats: {
        taijutsu: finalTaijutsu,
        ninjutsu: finalNinjutsu,
        genjutsu: finalGenjutsu,
        chakraAmount: finalChakraAmount,
        chakraControl: finalChakraControl,
      },
      userAssignedStats: customStats || { taijutsu: 0, ninjutsu: 0, genjutsu: 0, chakraAmount: 0, chakraControl: 0 }, // Store user-assigned points
      baseRandomStats: existingCharacterData ? existingCharacterData.baseRandomStats : { taijutsu: baseTaijutsu, ninjutsu: baseNinjutsu, genjutsu: baseGenjutsu, chakraAmount: baseChakraAmount, chakraControl: baseChakraControl }, // Store the initial random stats
      imageUrl: imageUrl,
      experience: experience,
      level: level,
      attributePoints: attributePoints
    };

    const saveButton = document.createElement("button");
    saveButton.classList.add("py-1", "px-2", "text-white", "border-none", "rounded-md", "cursor-pointer", "transition-colors", "duration-300", "ease-in-out", "bg-blue-500", "hover:bg-blue-700", "absolute", "top-2", "left-2");
    saveButton.textContent = "Guardar";
    saveButton.addEventListener("click", () => saveCharacter(characterData));
    card.appendChild(saveButton);

    card.appendChild(title);
    card.appendChild(village);
    card.appendChild(rank);
    card.appendChild(affiliation);
    card.appendChild(chakraNature);
    card.appendChild(jutsus);
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

    // Append to the correct container based on the current view
    if (document.getElementById("create-character-view").classList.contains("hidden")) {
      // If not in create character view, assume it's for gallery or team
      return card;
    } else {
      characterCardContainer.innerHTML = ""; // Clear previous card in create view
      characterCardContainer.appendChild(card);
      return card;
    }
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

  function generateRandomJutsus(chakraNatures, characterLevel = 1) {
    const jutsuMap = {
      "Fuego": [
        { name: "Gran Bola de Fuego", rank: 1 },
        { name: "Jutsu de la Llamarada del Dragón", rank: 2 },
        { name: "Jutsu de la Ceniza Ardiente", rank: 3 }
      ],
      "Agua": [
        { name: "Jutsu de la Prisión de Agua", rank: 1 },
        { name: "Jutsu del Dragón de Agua", rank: 2 },
        { name: "Jutsu de la Gran Cascada", rank: 3 }
      ],
      "Rayo": [
        { name: "Chidori", rank: 2 },
        { name: "Kirin", rank: 4 },
        { name: "Raikiri", rank: 3 }
      ],
      "Tierra": [
        { name: "Jutsu del Muro de Tierra", rank: 1 },
        { name: "Jutsu del Golem de Tierra", rank: 2 },
        { name: "Jutsu de la Lanza de Tierra", rank: 3 }
      ],
      "Viento": [
        { name: "Rasengan", rank: 2 },
        { name: "Jutsu de la Gran Ruptura", rank: 1 },
        { name: "Jutsu de la Palma de Viento", rank: 2 }
      ],
      "Madera": [
        { name: "Jutsu Secreto de la Liberación de Madera: Nacimiento de un Mundo de Árboles", rank: 5 },
        { name: "Jutsu de la Prisión de Cuatro Pilares", rank: 3 },
        { name: "Jutsu del Dragón de Madera", rank: 4 }
      ],
      "Hielo": [
        { name: "Jutsu Secreto de la Liberación de Hielo: Cúpula de Hielo", rank: 4 },
        { name: "Jutsu de los Mil Golpes de Agua Voladores", rank: 3 },
        { name: "Jutsu de la Ventisca del Loto Negro", rank: 2 }
      ],
      "Lava": [
        { name: "Jutsu de la Bola de Fuego de Lava", rank: 2 },
        { name: "Jutsu de la Corriente de Lava", rank: 3 },
        { name: "Jutsu de la Armadura de Lava", rank: 4 }
      ],
      "Hierro": [
        { name: "Jutsu de la Bala de Hierro", rank: 1 },
        { name: "Jutsu del Escudo de Hierro", rank: 2 },
        { name: "Jutsu de la Prisión de Hierro", rank: 3 }
      ],
      "Polvo": [
        { name: "Jutsu de la Partícula", rank: 5 },
        { name: "Jutsu de la Separación Atómica", rank: 4 }
      ],
      "Vapor": [
        { name: "Jutsu de la Niebla Ácida", rank: 2 },
        { name: "Jutsu de la Explosión de Vapor", rank: 3 }
      ],
      "Cristal": [
        { name: "Jutsu del Laberinto de Cristal", rank: 3 },
        { name: "Jutsu del Shuriken de Cristal", rank: 2 },
        { name: "Jutsu del Pilar de Cristal", rank: 4 }
      ],
      "Oscuridad": [
        { name: "Jutsu de la Oscuridad", rank: 3 },
        { name: "Jutsu de la Absorción de Chakra", rank: 4 }
      ]
    };

    const selectedJutsus = [];
    const naturesArray = chakraNatures.split(', ').map(nature => nature.trim());

    naturesArray.forEach(nature => {
      if (jutsuMap[nature]) {
        const availableJutsus = jutsuMap[nature].filter(jutsu => jutsu.rank <= characterLevel + 1); // Allow slightly higher rank jutsus
        if (availableJutsus.length > 0) {
          const randomJutsu = availableJutsus[Math.floor(Math.random() * availableJutsus.length)];
          selectedJutsus.push(randomJutsu.name);
        }
      }
    });

    // For level 1 characters, limit to max 4 jutsus
    if (characterLevel === 1 && selectedJutsus.length > 4) {
      return getRandomArrayElements(selectedJutsus, 4).join(", ");
    }

    if (selectedJutsus.length === 0) {
      return "Ningún Jutsu conocido para esta naturaleza de Chakra.";
    }

    return selectedJutsus.join(', ');
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

  function calculateLevel(experience) {
    // Simple logarithmic scale: level = floor(log10(experience + 1) * 5) + 1
    // This makes leveling up harder as experience increases.
    const level = Math.floor(Math.log10(experience / 100 + 1) * 5) + 1;
    const attributePoints = level * 5; // 5 attribute points per level
    return { level, attributePoints };
  }

  function downloadCard(card) {
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${card.querySelector("h2").textContent}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  function populateCharacterForm(characterData) {
    document.getElementById("characterName").value = characterData.name;
    document.getElementById("cardBackgroundColor").value = getComputedStyle(document.documentElement).getPropertyValue('--card-background-color');
    document.getElementById("cardFont").value = getComputedStyle(document.documentElement).getPropertyValue('--card-font-family');

    // Set initialRandomStats for the loaded character
    initialRandomStats = characterData.baseRandomStats;

    document.getElementById("taijutsuPoints").value = characterData.userAssignedStats.taijutsu;
    document.getElementById("ninjutsuPoints").value = characterData.userAssignedStats.ninjutsu;
    document.getElementById("genjutsuPoints").value = characterData.userAssignedStats.genjutsu;
    document.getElementById("chakraAmountPoints").value = characterData.userAssignedStats.chakraAmount;
    document.getElementById("chakraControlPoints").value = characterData.userAssignedStats.chakraControl;
    // For image, we can't set the file input value directly for security reasons.
    // We can store the image URL in a data attribute and use it when generating the card.
    if (characterData.imageUrl) {
      document.getElementById("characterImage").dataset.imageDataUrl = characterData.imageUrl;
    } else {
      delete document.getElementById("characterImage").dataset.imageDataUrl;
    }
    updateRemainingPoints();
  }

  function saveCharacter(characterData) {
    const existingIndex = savedCharacters.findIndex(char => char.name === characterData.name);
    if (existingIndex > -1) {
      savedCharacters[existingIndex] = characterData;
    } else {
      savedCharacters.push(characterData);
    }
    saveAllCharacters();
    alert("Personaje guardado!");
    displayGallery();
  }

  function saveAllCharacters() {
    localStorage.setItem("ninjaCharacters", JSON.stringify(savedCharacters));
  }

  function loadCharacters() {
    characterGallery.innerHTML = ""; // Clear existing gallery items
    if (savedCharacters.length === 0) {
      alert("No hay personajes guardados.");
      return;
    }
    savedCharacters.forEach(characterData => {
      const card = generateCharacterCard(characterData.name, characterData.userAssignedStats, characterData.imageUrl, characterData, characterData.author);
      characterGallery.appendChild(card);
    });
    populateBattleSelectors();
  }

  function generateTeam() {
    teamContainer.innerHTML = ""; // Clear existing team members
    const teamSize = Math.floor(Math.random() * 2) + 3; // Generate 3 or 4 characters
    for (let i = 0; i < teamSize; i++) {
      const randomName = "Ninja " + (Math.floor(Math.random() * 1000) + 1);
      const card = generateCharacterCard(randomName, null, null); // Generate a random character
      teamContainer.appendChild(card);
    }
  }

  function displayGallery() {
    const savedCharacters = JSON.parse(localStorage.getItem("ninjaCharacters")) || [];
    characterGallery.innerHTML = ""; // Clear existing gallery items

    savedCharacters.forEach((characterData, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.classList.add("w-32", "h-40", "border", "border-gray-300", "rounded-lg", "shadow-lg", "cursor-pointer", "overflow-hidden", "relative");
      galleryItem.style.backgroundColor = "var(--card-background-color)";
      galleryItem.style.fontFamily = "var(--card-font-family)";

      if (characterData.imageUrl) {
        const img = document.createElement("img");
        img.src = characterData.imageUrl;
        img.classList.add("w-full", "h-24", "object-cover");
        galleryItem.appendChild(img);
      }

      const name = document.createElement("p");
      name.textContent = characterData.name;
      name.classList.add("text-center", "font-bold", "text-sm", "mt-2");
      galleryItem.appendChild(name);

      galleryItem.addEventListener("click", () => {
        characterCardContainer.innerHTML = ""; // Clear current card
        populateCharacterForm(characterData);
        generateCharacterCard(characterData.name, characterData.stats, characterData.imageUrl, characterData);
        showView("create-character-view"); // Switch to create character view
      });

      characterGallery.appendChild(galleryItem);
    });
  }

  function populateBattleSelectors() {
    const savedCharacters = JSON.parse(localStorage.getItem("ninjaCharacters")) || [];
    character1Select.innerHTML = "<option value=\"\">Seleccionar Personaje 1</option>";
    character2Select.innerHTML = "<option value=\"\">Seleccionar Personaje 2</option>";

    savedCharacters.forEach((character, index) => {
      const option1 = document.createElement("option");
      option1.value = index;
      option1.textContent = character.name;
      character1Select.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = index;
      option2.textContent = character.name;
      character2Select.appendChild(option2);
    });
  }

  function startBattle() {
    const savedCharacters = JSON.parse(localStorage.getItem("ninjaCharacters")) || [];
    const char1Index = character1Select.value;
    const char2Index = character2Select.value;

    if (char1Index === "" || char2Index === "") {
      battleLog.textContent = "Por favor, selecciona dos personajes para la batalla.";
      return;
    }

    if (char1Index === char2Index) {
      battleLog.textContent = "No puedes seleccionar el mismo personaje para la batalla.";
      return;
    }

    const char1 = savedCharacters[char1Index];
    const char2 = savedCharacters[char2Index];

    battleLog.innerHTML = `<h3>¡Comienza la batalla entre ${char1.name} y ${char2.name}!</h3>`;

    let char1Score = 0;
    let char2Score = 0;

    // Compare Taijutsu
    if (char1.stats.taijutsu > char2.stats.taijutsu) {
      char1Score++;
      battleLog.innerHTML += `<p>${char1.name} tiene ventaja en Taijutsu.</p>`;
    } else if (char2.stats.taijutsu > char1.stats.taijutsu) {
      char2Score++;
      battleLog.innerHTML += `<p>${char2.name} tiene ventaja en Taijutsu.</p>`;
    } else {
      battleLog.innerHTML += `<p>Taijutsu empatado.</p>`;
    }

    // Compare Ninjutsu
    if (char1.stats.ninjutsu > char2.stats.ninjutsu) {
      char1Score++;
      battleLog.innerHTML += `<p>${char1.name} tiene ventaja en Ninjutsu.</p>`;
    } else if (char2.stats.ninjutsu > char1.stats.ninjutsu) {
      char2Score++;
      battleLog.innerHTML += `<p>${char2.name} tiene ventaja en Ninjutsu.</p>`;
    }

    // Compare Genjutsu
    if (char1.stats.genjutsu > char2.stats.genjutsu) {
      char1Score++;
      battleLog.innerHTML += `<p>${char1.name} tiene ventaja en Genjutsu.</p>`;
    } else if (char2.stats.genjutsu > char1.stats.genjutsu) {
      char2Score++;
      battleLog.innerHTML += `<p>${char2.name} tiene ventaja en Genjutsu.</p>`;
    }

    // Compare Chakra Amount
    if (char1.stats.chakraAmount > char2.stats.chakraAmount) {
      char1Score++;
      battleLog.innerHTML += `<p>${char1.name} tiene más Chakra.</p>`;
    } else if (char2.stats.chakraAmount > char1.stats.chakraAmount) {
      char2Score++;
      battleLog.innerHTML += `<p>${char2.name} tiene más Chakra.</p>`;
    }

    // Compare Chakra Control
    if (char1.stats.chakraControl > char2.stats.chakraControl) {
      char1Score++;
      battleLog.innerHTML += `<p>${char1.name} tiene mejor control de Chakra.</p>`;
    } else if (char2.stats.chakraControl > char1.stats.chakraControl) {
      char2Score++;
      battleLog.innerHTML += `<p>${char2.name} tiene mejor control de Chakra.</p>`;
    }

    // Determine winner
    if (char1Score > char2Score) {
      battleLog.innerHTML += `<h3>¡${char1.name} gana la batalla!</h3>`;
      char1.experience += 100; // Award experience
      const levelData = calculateLevel(char1.experience);
      char1.level = levelData.level;
      char1.attributePoints = levelData.attributePoints;
      savedCharacters[char1Index] = char1; // Update character in array
    } else if (char2Score > char1Score) {
      battleLog.innerHTML += `<h3>¡${char2.name} gana la batalla!</h3>`;
      char2.experience += 100; // Award experience
      const levelData = calculateLevel(char2.experience);
      char2.level = levelData.level;
      char2.attributePoints = levelData.attributePoints;
      savedCharacters[char2Index] = char2; // Update character in array
    } else {
      battleLog.innerHTML += `<h3>¡La batalla termina en empate!</h3>`;
    }

    saveAllCharacters(); // Save updated characters
    displayGallery(); // Refresh gallery
    populateBattleSelectors(); // Refresh battle selectors
  }

  // Initial display of gallery on page load
  displayGallery();
  populateBattleSelectors();
});
