// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-MATTHEW"; // Make sure to change this!
const API = BASE + COHORT;

let players = [];

const getPlayers = async () => {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    players = result.data;
    render();
    console.log(players);
  } catch (e) {
    console.error(e);
  }
};

const getPlayer = async (id) => {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPlayer = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
};

const render = () => {
  const $app = document.querySelector("#app");
};

const start = async () => {
  await getPlayers();
  render();
};

start();
