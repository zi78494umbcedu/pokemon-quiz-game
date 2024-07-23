//1) Get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

//8) Initialize variables
let usedPokemonIds = [];
let count = 0; //15.3
let points = 0;
let showLoading = false;

//2)Create function to fetch one Pokemon with an ID
async function fetchPokemonById(id) {
  showLoading = true;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// //3) Create a test function to see result of step 2
// async function testFetch() {
//   const pokemon = await fetchPokemonById(getRandomPokemonId());
//   console.log(pokemon);
// }

// //4) call test function
// testFetch();

//6) function to load question with options
async function loadingQuestionWithOptions() {
  if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow();
  }
  //7) fetch the correct answer
  let pokemonId = getRandomPokemonId();

  //8.2) Check if current questions has been used already
  while (usedPokemonIds.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }

  //8.3) If pokemon has not been displayed yet, it is added to the usedPokemonIds. And it is set as a new const pokemon
  usedPokemonIds.push(pokemonId);
  const pokemon = await fetchPokemonById(pokemonId);

  //9) Create constants array
  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  //10) Fetch additional random Pokemon names to use as options
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();
    while (optionsIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    }
    optionsIds.push(randomPokemonId);

    //10.2) Fetching a random pokemon with the newly made Id, and adding it to the options array.
    const randomPokemon = await fetchPokemonById(randomPokemonId);
    const randomOption = randomPokemon.name;
    options.push(randomOption);

    //10.3) Test
    console.log(options);
    console.log(optionsIds);
  }

  //16.5) Turn off loading if all options have been fetchded
  if (options.length == 4) {
    showLoading = false;
  }
  shuffleArray(options);

  //13) Clear any previous result and update pokemon Image to fetched image URL from the sprites.
  resultElement.textContent = "Who's that Pokémon?";
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

  //14) Create options HTML elements from options array in the DOM.
  optionsContainer.innerHTML = "";
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === pokemon.name, event);
    optionsContainer.appendChild(button);
  });

  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

//15) Create checkAnswer function
function checkAnswer(isCorrect, event) {
  console.log("ashwin");
  //15.1) Check if any button is already selected, if falsy=>no element => null
  const selectedButton = document.querySelector(".selected");

  //15.2) If already a button is selected, do nothing, exit function
  if (selectedButton) {
    return;
  }
  //15.4) Else mark the clicked button as selected and increase the count by 1.
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  if (isCorrect) {
    //15.7) call displayedResult function
    displayResult("Correct answer!");
    //15.8) If correct icnrease the points b 1
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong answer...");
    event.target.classList.add("wrong");
  }

  //15.9) Load the next question with a 1 s delay for the user to read the result

  setTimeout(() => {
    showLoading = true;
    loadingQuestionWithOptions();
  }, 1000);
}

//11)initial load
loadingQuestionWithOptions();

// --- UTILITY FUNCTIONS ---
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
  //// The sort method expects the callback function to return a value less than 0, equal to 0, or greater than 0. Based on this returned value, it determines the sorting order. If you used Math.random() directly without subtracting 0.5, the callback function would generate values between 0 and 1. Since the sort method expects a comparison result that can be negative, zero, or positive, the absence of the 0.5 would lead to a biased sorting behavior. By subtracting 0.5, you ensure that the values generated by Math.random() are equally likely to be negative or positive.
}

//5) function to randomize the pokemon ID
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

//15.5) function to update result text and class name
function displayResult(result) {
  resultElement.textContent = result;
}

//17) Hide loading
function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

//18) Show loading window
function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}

//19) Show puzzle window
function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");
}

//20) Hide Puzzle Window
function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}
