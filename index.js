const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2505-Matthew";
const $form = document.createElement("form");
const $main = document.querySelector("main");
const $content = document.querySelector("#content");
let teams = [];

async function fetchAllPlayers() {
  try {
    const response = await fetch(API_URL + "/players");
    const result = await response.json();
    players = result.data.players;
    console.log(players);
    return players;
  } catch (err) {
    console.error(err.message);
  }
}

async function createPlayer(name, breed, imageUrl) {
  try {
    const response = await fetch(API_URL + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, breed, imageUrl }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    return result.data.player;
  } catch (err) {
    console.error(err.message);
  }
}

async function fetchPlayerById(id) {
  try {
    const response = await fetch(API_URL + "/players/" + id);
    const result = await response.json();
    return result.data.player;
  } catch (err) {
    console.error(err.message);
  }
}

async function removePlayerById(id) {
  try {
    const response = await fetch(API_URL + "/players/" + id, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err.message);
  }
}

async function renderAllPlayers() {
  $form.innerHTML = `
      <h2>Please enter puppy you would like to add!</h2>
      <label>Name: <input required id="new-name" type="text" /></label>
      <label>Breed: <input required id="new-breed" type="text" /></label>
      <label>Image URL: <input id="new-image" type="text" /></label>
      <button>Submit</button>
    `;
  const playerList = await fetchAllPlayers();
  const $players = document.createElement("ul");
  $players.id = "player-list";
  playerList.forEach((player) => {
    const $player = document.createElement("li");
    $player.className = "player-card";
    $player.innerHTML += `
        <h2>${player.name}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <p> No puppy selected, would you like to select this puppy?</p>
            <button class="details-btn">See Details</button>
        </section>
        `;
    $detailsBtn = $player.querySelector(".details-btn");

    $detailsBtn.addEventListener("click", async () => {
      try {
        await renderSinglePlayer(player.id);
      } catch (err) {
        console.error(err.message);
      }
    });

    $players.appendChild($player);
  });

  $main.innerHTML = "";
  $main.appendChild($form);
  $main.appendChild($players);
}

async function renderSinglePlayer(id) {
  const player = await fetchPlayerById(id);

  $main.innerHTML = `
    <section id="single-player">
        <h2>${player.name} (${player.breed}) - ${player.status}</h2>
        <p><b>ID:</b> ${player.id}</p>
        <p><b>Team:</b> ${player.team?.name || "Unassigned"}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <button id="back-btn">Back to List</button>
        <h3>Do you want to remove this player?</h3>
         <button class="remove-btn">Remove Player</button>
    </section>
    `;
  $main.querySelector("#back-btn").addEventListener("click", async () => {
    try {
      await renderAllPlayers();
    } catch (err) {
      console.error(err.message);
    }
  });

  $removeBtn = $main.querySelector(".remove-btn");
  $removeBtn.addEventListener("click", async () => {
    try {
      const confirmRemove = confirm(
        `Are you sure you want to remove ${player.name} from the roster?`
      );
      if (!confirmRemove) return;
      await removePlayerById(player.id);
      await renderAllPlayers();
    } catch (err) {
      console.error(err.message);
    }
  });
}

async function init() {
  try {
    await renderAllPlayers();
  } catch (err) {
    console.error(err);
  }
}

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#new-name").value;
  const breed = document.querySelector("#new-breed").value;
  const image = document.querySelector("#new-image").value;

  try {
    await createPlayer(name, breed, image);
    await renderAllPlayers();
  } catch (err) {
    console.error(err.message);
  } finally {
    document.querySelector("#new-name").value = "";
    document.querySelector("#new-breed").value = "";
    document.querySelector("#new-image").value = "";
  }
});

init();
