/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (const game of games) {
        // create a new div element, which will become the game card
        let gameCard = document.createElement('div'); 

        // add the class game-card to the list
        gameCard.classList.add('game-card');
        gameCard.id = game.name;

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img">
            <p style="font-weight:bold;">${game.name}</p>
            <p>${game.description}</p>
            <p>Backers: ${game.backers}</p>
        `;


        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalBackers = GAMES_JSON.reduce( (backers, game) => backers + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const formattedBackerCount = totalBackers.toLocaleString('en-US');
contributionsCard.innerHTML = `
    <p style="color:white;">${formattedBackerCount} </p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalContributionsFromBackers = GAMES_JSON.reduce( (totalContributions, game) => totalContributions + game.pledged, 0);

// set inner HTML using template literal
const formattedContributions = totalContributionsFromBackers.toLocaleString('en-US');
raisedCard.innerHTML = `
    <p style="color:white;">$${formattedContributions} </p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.reduce( (totalGames, game) => totalGames + 1, 0);
gamesCard.innerHTML = `
    <p style="color:white;">${totalGames} </p>
`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const listOfUnfundedGames = GAMES_JSON.filter( (game) => {
    return game.pledged < game.goal;
});
const underfundedGamesCount = listOfUnfundedGames.length;

// create a string that explains the number of unfunded games using the ternary operator
const oneGameUnfunded = `A total of $${formattedContributions} has been raised for ${GAMES_JSON.length} games. Currently, 1 game remains unfunded. We need your help to fund these amazing games!`;
const multipleGamesUnfunded =  `A total of $${formattedContributions} has been raised for ${GAMES_JSON.length} games. Currently, ${underfundedGamesCount} games remain unfunded. We need your help to fund these amazing games!`;;

const displayStr = underfundedGamesCount > 1 ? multipleGamesUnfunded : oneGameUnfunded;

// create a new DOM element containing the template string and append it to the description container
let unfundedDescription = document.createElement('p'); 
unfundedDescription.innerHTML = `<p>${displayStr}</p>`;
descriptionContainer.appendChild(unfundedDescription);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const mostPledgedElement = document.createElement('p'); 
const mostPledgedGameCard = document.getElementById("first-game");
mostPledgedElement.innerHTML = `
    ${firstGame.name}
`;
mostPledgedGameCard.appendChild(mostPledgedElement);

// do the same for the runner up item
const secondMostPledgedElement = document.createElement('p'); 
const secondMostPledgedGameCard = document.getElementById("second-game");
secondMostPledgedElement.innerHTML = `
    ${secondGame.name}
`;
secondMostPledgedGameCard.appendChild(secondMostPledgedElement);

/************************************************************************************
 * Bonus Features:
 */
// Show goal and pledges and "allow" pledges
function openPledgeDialog(gameId, event) {
    event.stopPropagation();

    const game = GAMES_JSON.find( (game) => {
        return game.name == gameId;
    });
    if (!game) return;
    const goal = game.goal.toLocaleString('en-US');
    const pledged = game.pledged.toLocaleString('en-US');

    const dialogElement = document.createElement('div'); 
    dialogElement.innerHTML = `
    <dialog id="gameCardDialog">
        <p>$${pledged} out of $${goal} pledged.</p>
        <div>
            <p>Would you like to pledge?</p>
            $<input type="text" inputmode="numeric" pattern="[0-9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');" />
            <button id="pledge-btn">Pledge</button>
        </div>
        <button id="close-btn">Close</button>
    </dialog>
    `;

    const gameCard = document.getElementById(game.name);
    if (gameCard) {
        gameCard.appendChild(dialogElement);

        const dialog = dialogElement.querySelector("#gameCardDialog");
        dialog.showModal();

        dialog.querySelector("#pledge-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            dialog.close();
            dialogElement.remove();
            makePledge(gameCard);
        });

        dialog.querySelector("#close-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            dialog.close();
            dialogElement.remove();
        });
    }
}

document.getElementById("games-container").addEventListener("click", (event) => {
    const child = event.target.closest("#games-container > *");

    if (child) {
        openPledgeDialog(child.id, event);
    }
});

function makePledge(gameCard) {
    const successDialog = document.createElement('div'); 
    successDialog.innerHTML = `
    <dialog id="successfulPledgeDialog">
        <p>Thank you for your support!</p>
        <p>Your pledge has been registered successfully.</p>
        <button id="success-close-btn">Finish</button>
    </dialog>
    `;

    gameCard.appendChild(successDialog);
    const dialog = successDialog.querySelector("#successfulPledgeDialog");
    dialog.showModal();

    dialog.addEventListener("click", (event) => event.stopPropagation());
    dialog.querySelector("#success-close-btn").addEventListener("click", (event) => {
        event.stopPropagation();
        dialog.close();
        successDialog.remove();
    });
}


// Search bar
const searchElement = document.createElement("div");
searchElement.id = "search-bar";
searchElement.innerHTML = `<input type="search" id="search-input" placeholder="Search games...">`; 
searchElement.style.maxWidth = "500px";
searchElement.style.margin = "0 auto";
searchElement.style.padding = "10px";
const searchBar = document.getElementById("search-container");
searchBar.append(searchElement);
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", (event) => {
    const filter = event.target.value.toLowerCase();
    const gameCards = document.querySelectorAll(".game-card");
    gameCards.forEach(game => {
        const name = game.id.toLowerCase();
        if (name.includes(filter)) {
            game.style.display = "";
        } else {
            game.style.display = "none";
        }
    });
});
