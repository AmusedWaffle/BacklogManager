
let exampleGames = [
    "Elden Ring",
    "Cyberpunk 2077",
    "God of War",
    "Hollow Knight",
    "The Legend of Zelda",
    "Super Mario Odyssey",
    "Red Dead Redemption 2",
    "Dark Souls III",
    "Persona 5 Royal",
    "Sekiro: Shadows Die Twice"
];

let currentSelectedGame = "";

function openGamePopup() {
document.getElementById("gamePopup").style.display = "flex";
document.getElementById("searchBar").value = "";
document.getElementById("searchResults").innerHTML = "";
currentSelectedGame = "";
}

function closeGamePopup() {
document.getElementById("gamePopup").style.display = "none";
}

function fetchExampleGames(searchQuery = "") {
const resultsContainer = document.getElementById("searchResults");
resultsContainer.innerHTML = "";

const filteredGames = exampleGames.filter(game =>
    game.toLowerCase().includes(searchQuery.toLowerCase())
);

filteredGames.forEach(game => {
    const gameElement = document.createElement("div");
    gameElement.textContent = game;
    gameElement.classList.add("search-result");
    gameElement.onclick = () => selectGame(game, gameElement);
    resultsContainer.appendChild(gameElement);
});
}

document.addEventListener("DOMContentLoaded", () => {
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", () => {
    const searchBar = document.getElementById("searchBar");
    fetchExampleGames(searchBar.value);
});
});

function selectGame(gameName, element) {
document.querySelectorAll(".search-result").forEach(el => {
    el.classList.remove("selected");
});
element.classList.add("selected");
currentSelectedGame = gameName;
}

function addSelectedGame() {
if (!currentSelectedGame) {
    alert("Please select a game before adding.");
    return;
}

const container = document.getElementById("addedGamesContainer");
const gameDiv = document.createElement("div");
gameDiv.textContent = currentSelectedGame;
gameDiv.classList.add("added-game");
container.appendChild(gameDiv);

currentSelectedGame = "";
closeGamePopup();
}


/*
let exampleGames = [
    "Elden Ring",
    "Cyberpunk 2077",
    "God of War",
    "Hollow Knight",
    "The Legend of Zelda",
    "Super Mario Odyssey",
    "Red Dead Redemption 2",
    "Dark Souls III",
    "Persona 5 Royal",
    "Sekiro: Shadows Die Twice"
];

let currentSelectedGame = "";

function openGamePopup() {
    document.getElementById("gamePopup").style.display = "flex";
    document.getElementById("searchBar").value = "";
    document.getElementById("searchResults").innerHTML = "";
    currentSelectedGame = "";
}

function closeGamePopup() {
    document.getElementById("gamePopup").style.display = "none";
}

function fetchExampleGames(searchQuery = "") {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    const filteredGames = exampleGames.filter(game =>
        game.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredGames.forEach(game => {
        const gameElement = document.createElement("div");
        gameElement.textContent = game;
        gameElement.classList.add("search-result");
        gameElement.onclick = () => selectGame(game, gameElement);
        resultsContainer.appendChild(gameElement);
    });
}

function selectGame(gameName, element) {
    document.querySelectorAll(".search-result").forEach(el => {
        el.classList.remove("selected");
    });
    element.classList.add("selected");
    currentSelectedGame = gameName;
}

function addSelectedGame() {
    if (!currentSelectedGame) {
        alert("Please select a game before adding.");
        return;
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
        alert("User not logged in. Please log in to add games.");
        return;
    }

    fetch("http://127.0.0.1:5000/add_game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail, game: currentSelectedGame })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const container = document.getElementById("addedGamesContainer");
            const gameDiv = document.createElement("div");
            gameDiv.textContent = currentSelectedGame;
            gameDiv.classList.add("added-game");
            container.appendChild(gameDiv);
            currentSelectedGame = "";
            closeGamePopup();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => {
        console.error("Error saving game:", err);
        alert("Error saving game");
    });
}

function loadUserGames() {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) return;

    fetch(`http://127.0.0.1:5000/get_games?email=${userEmail}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("addedGamesContainer");
            data.forEach(game => {
                const gameDiv = document.createElement("div");
                gameDiv.textContent = game.gameid;
                gameDiv.classList.add("added-game");
                container.appendChild(gameDiv);
            });
        })
        .catch(err => console.error("Error loading games:", err));
}

document.addEventListener("DOMContentLoaded", loadUserGames);
*/