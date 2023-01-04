// NOTES
// instead of using pop to remove the card, do we want to select a card at 
// random and then remove it from the deck

// document.addEventListener("DOMContentLoaded", setUpListeners)
// javascript global variables

// dealer sum
var dealerSum = 0;
// user sum
var userSum = 0;
// variable for hidden card- first card for the dealer
var hidden;
// variable for deck
var deck;
// takeAnother allows the user to draw while userSum <= 21
var takeAnother = true;
// a flag to indicate that the game has ended
final_game_result = false;
// a flag to indicate that the user won or lost
final_game_winner = "NA";



document.addEventListener("DOMContentLoaded", setUpListeners)

function setUpListeners() {
    const e = document.querySelector("#new_game_btn")
    e.addEventListener("click", newGame)
    const e2= document.querySelector("#reset_btn")
    e2.addEventListener("click", resetScore)
}

function newGame(){
    location.reload();
}

window.onload = function (){
    // setLocalStorage();
    buildDeck();
    shuffleDeck();
    startGame();
    gameResult();
}


// the game appears only when newGame is clicked
// function showGame() {
//     get the game box
//     var myGame = document.getElementById('game_box_id');
//     // get the current value of the game box's display property
//     var displaySetting = myGame.style.display;
//     console.log("display setting of game box", displaySetting);
//     // // also get the new game button, so we can change what it says
//     // var newGameButton = document.getElementById('new_game_btn');

//     // make the game box visible and ready to run
//     if (displaySetting == 'none') {
//         myGame.style.display = 'block';
//         // newGame()
//     }
//   }


//  we cannot load the game without building the deck
//  this function will push all the images into the deck
function buildDeck(){
    let values = ["2","3","4", "5", "6", "7", "8", "9", "10", "ace", "king", "queen", "jack"];
    let types = ["clubs", "diamonds", "hearts", "spades"];
    deck = []
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "_of_" + types[i]);
        }
    // printing out the deck
    }
    // console.log(deck);
}

// now that we have the deck, we will shuffle the deck and randomly pick a card
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let random_index = Math.floor(Math.random()* deck.length);
        // returns a random number between 0 and 52

        // we swap the current card with this randomly chosen card
        let temp = deck[i];
        deck[i] = deck[random_index];
        deck[random_index] = temp;
    }
    // as we iterate through the entire deck, we shuffle each card with another
    // randomly selected card using shuffleDeck()
}

function startGame(){
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    console.log("hidden card:", hidden);
    console.log("dealer sum:", dealerSum);

    // give cards to the user- starts with two cards
    for (let i = 0; i < 2; i++){
        let cardImg = document.createElement("img"); // creates an image tag 
        let selected_card = deck.pop();
        cardImg.src = "./images/" + selected_card + ".png";
        userSum += getValue(selected_card);
        document.getElementById("user_cards").append(cardImg);
        // add the card image to the image tag with id = user_cards
    }

    // The dealer has one hidden card and is assigned one card in the beginning
    let cardImg = document.createElement("img"); // creates an image tag 
    let selected_card = deck.pop();
    cardImg.src = "./images/" + selected_card + ".png";
    dealerSum += getValue(selected_card);
    document.getElementById("dealer_cards").append(cardImg);
    

    console.log("userSum after loop", userSum);
    document.getElementById("user_take_another").addEventListener("click", takeAnotherCard);
    document.getElementById("user_stand").addEventListener("click", userStand);
}

function userStand(){
    // only allowed to Stand if userSum is less than 21
    if (!takeAnother) {
        return; 
    }

    if ( userSum < 21) {
        // once the user has decided to stand, they cannot take another card
        takeAnother = false;
        // starting the game with the dealer
        while (dealerSum < 17) {
            let cardImg = document.createElement("img"); // creates an image tag 
            let selected_card = deck.pop();
            cardImg.src = "./images/" + selected_card + ".png";
            dealerSum += getValue(selected_card);
            // add the card image to the image tag with id = dealer_cards
            document.getElementById("dealer_cards").append(cardImg);
            

            // if dealer reaches 21 cards, dealer instantly wins
            if (dealerSum == 21) {
                document.getElementById("hidden").src =  "./images/" + hidden + ".png";
                document.getElementById("dealer_sum").innerText = dealerSum;
                document.getElementById("user_sum").innerText = userSum;
                document.getElementById("results").innerText = "You Lose!";
                takeAnother = false;
                final_game_result = true;
                final_game_winner = "NO";
                gameResult();
            }
            console.log("dealerSum within while loop", dealerSum)
            // if the dealer goes over 21 points, dealer instantly loses
            if (dealerSum > 21) {
                document.getElementById("hidden").src =  "./images/" + hidden + ".png";
                document.getElementById("dealer_sum").innerText = dealerSum;
                document.getElementById("user_sum").innerText = userSum;
                document.getElementById("results").innerText = "You Win!";
                takeAnother = false;
                final_game_result = true;
                final_game_winner = "YES";
                gameResult();
            }
        }

        // Exit the while loop when the dealerSum is between 18-20
        console.log("dealerSum after while loop", dealerSum)

        // if the dealer has 17-20 points, do the following
        if (dealerSum > 16 && dealerSum < 21) {
            // at this point the hidden card with the dealer is revealed
            document.getElementById("hidden").src =  "./images/" + hidden + ".png";
            
            // a series of decisions are made to determine the result
            let message = "";
            if (userSum > 21) {
                message = "You Lose!";
                final_game_winner = "NO";
            }
            // user and dealer sum are both less than 21
            else if (userSum == dealerSum) {
                message = "Tied";
                final_game_winner = "NA";
            }
            else if (userSum > dealerSum) {
                message = "You Win!";
                final_game_winner = "YES";
            }
            else if (userSum < dealerSum) {
                message = "You Lose!";
                final_game_winner = "NO";
            }

            document.getElementById("dealer_sum").innerText = dealerSum;
            document.getElementById("user_sum").innerText = userSum;
            document.getElementById("results").innerText = message;
            final_game_result = true;
            gameResult();
          }
    }
}

function takeAnotherCard() {
    if (!takeAnother) {
        return; 
    }
    // if the user can take another card, then we allow the user to pick one on a click!
    let cardImg = document.createElement("img"); // creates an image tag 
    let selected_card = deck.pop();
    cardImg.src = "./images/" + selected_card + ".png";
    userSum += getValue(selected_card);
    document.getElementById("user_cards").append(cardImg);
    // add the card image to the image tag with id = dealer_cards

    if (userSum > 21) {
        takeAnother = false
        document.getElementById("dealer_sum").innerText = dealerSum;
        document.getElementById("user_sum").innerText = userSum;
        document.getElementById("results").innerText = "You Lose!";
        document.getElementById("hidden").src =  "./images/" + hidden + ".png";
        // document.getElementById("user_play_buttons").disabled = true;
        // refer- https://stackoverflow.com/questions/13831601/disabling-and-enabling-a-html-input-button
        takeAnother = false;
        final_game_result = true;
        final_game_winner = "NO";
        gameResult();
    }
    if (userSum == 21) {
        takeAnother = false
        document.getElementById("dealer_sum").innerText = dealerSum;
        document.getElementById("user_sum").innerText = userSum;
        document.getElementById("results").innerText = "You Win!";
        document.getElementById("hidden").src =  "./images/" + hidden + ".png";
        takeAnother = false;
        final_game_result = true;
        final_game_winner = "YES";
        gameResult();
    }
}

function getValue(card){
    let card_name_list = card.split("_of_"); //this will give an array with value and type
    let card_name = card_name_list[0];
    // we get the prefix from the card name, it could either be a number or a string
    if (isNaN(card_name)){ // isNaN checks if the card_name is not a number
        if (card_name == "ace") {
            return 11;
        }
        return 10;
    }
    return parseInt(card_name);
    // if the card_name is not a number, then its either ace, king, queen or jack
    // the value for ace is 11 and for the other three is 10
    // if it is not a number then it returns the integer value of the 
}

// animation

function flipCard(card) {
    const btn = document.getElementById('user_stand')
    function handleFlip() {
        front.classList.toggle('flipped')
        back.classList.toggle('flipped')
      }
      btn.addEventListener('click', handleFlip)
}


// local storage session
// localStorage.clear()
default_scoreboard = 0
// function setLocalStorage() {
if(!localStorage.getItem("total_games_played")){
    window.localStorage.setItem("total_games_played", default_scoreboard.toString());
}
if(!localStorage.getItem("total_wins_user")){
    window.localStorage.setItem("total_wins_user", default_scoreboard.toString());
}
if(!localStorage.getItem("total_losses_user")){
    window.localStorage.setItem("total_losses_user", default_scoreboard.toString());
}
if(!localStorage.getItem("total_ties_user")){
    window.localStorage.setItem("total_ties_user", default_scoreboard.toString());
}

var total_games_played = parseInt(localStorage.getItem('total_games_played'));
var total_wins_user = parseInt(localStorage.getItem('total_wins_user'));
var total_losses_user = parseInt(localStorage.getItem('total_losses_user'));
var total_ties_user = parseInt(localStorage.getItem('total_ties_user'));

document.getElementById("total_games").innerText = total_games_played;
document.getElementById("total_wins").innerText = total_wins_user;
document.getElementById("total_losses").innerText = total_losses_user;
document.getElementById("total_ties").innerText = total_ties_user;

console.log("total_games", total_games_played);
console.log("total_wins", total_wins_user);
console.log("total_losses", total_losses_user);
console.log("total_ties", total_ties_user);

// localStorage.clear()

function gameResult(){
    if (final_game_result) {
        total_games_played = parseInt(localStorage.getItem('total_games_played')) + 1;
        localStorage.setItem("total_games_played", total_games_played.toString());
        if (final_game_winner == "YES") {
            total_wins_user = parseInt(localStorage.getItem('total_wins_user')) + 1;
            localStorage.setItem("total_wins_user", total_wins_user.toString());
        }
        else if (final_game_winner == "NO")  {
            total_losses_user = parseInt(localStorage.getItem('total_losses_user')) + 1;
            localStorage.setItem("total_losses_user", total_losses_user.toString());
        }
        else {
            total_ties_user = parseInt(localStorage.getItem('total_ties_user'))  + 1;
            localStorage.setItem("total_ties_user", total_ties_user.toString());
        }

        document.getElementById("total_games").innerText = total_games_played;
        document.getElementById("total_wins").innerText = total_wins_user;
        document.getElementById("total_losses").innerText = total_losses_user;
        document.getElementById("total_ties").innerText = total_ties_user;
    }
}

function resetScore(){
    console.log("calling resetScore")
    // const reset = document.getElementById("reset_btn")
    // reset.addEventListener("click", () =>{
    //     localStorage.clear();
    // })
    // newGame()
    // document.getElementById("reset_btn").addEventListener("click", function() {
    //     localStorage.clear();
    // });
    localStorage.clear();
    reset_value = default_scoreboard.toString()
    document.getElementById("total_games").innerText = reset_value;
    document.getElementById("total_wins").innerText = reset_value;
    document.getElementById("total_losses").innerText = reset_value;
    document.getElementById("total_ties").innerText = reset_value;
    newGame()
}


// function flipCard(card) {
//     back src="images/face_down.png"
// }
//Referrences:
// https://www.youtube.com/watch?v=bMYCWccL-3U
// https://stackoverflow.com/questions/29884654/button-that-refreshes-the-page-on-click
// https://blog.logrocket.com/localstorage-javascript-complete-guide/
// https://www.w3schools.com/jsref/jsref_tostring_number.asp
// https://stackoverflow.com/questions/44564795/how-to-keep-localstorage-values-after-refresh


