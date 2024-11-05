let currentHeight = 10; 
let attemptsLeft = 3;
let currentPlayer = 1;
let currentTurn = 1; 
const maxPlayers = 4;
let highestJump = Array(4).fill(0); //Meilleur saut de chaque joueur
let playerHeights = Array(4).fill(10); // hauteur prochaine a tester

const maxTurns = 5;

const playerNames = [
    localStorage.getItem("player1"),
    localStorage.getItem("player2"),
    localStorage.getItem("player3"),
    localStorage.getItem("player4")
];

function startGameForPlayer() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById("currentPlayerNameGame").textContent = playerNames[currentPlayer - 1];
    resetGame();
}

document.getElementById('startGame').addEventListener('click', startGameForPlayer);

function rollDice() {
    let rolls = [];
    for (let i = 0; i < 5; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    displayDice(rolls);
    return rolls;
}

function displayDice(rolls) {
    const diceContainer = document.getElementById('diceRolls');
    diceContainer.innerHTML = ""; 

    rolls.forEach(roll => {
    const diceDiv = document.createElement("div");
    diceDiv.classList.add("dice");
    diceDiv.textContent = roll;

    diceContainer.appendChild(diceDiv);
    });
}


function displayMessage(message) {
    document.getElementById('messageArea').innerText = message;
}

function updateHeight() {
    document.getElementById('currentHeight').innerText = playerHeights[currentPlayer - 1]; 
}

document.getElementById('attemptJump').addEventListener('click', function() {
    if (attemptsLeft > 0) {
        let rolls = rollDice();
        let total = rolls.reduce((a, b) => a + b, 0);
        document.getElementById('diceResult').innerText = `Total: ${total}`;

        if (total >= playerHeights[currentPlayer - 1]) {
            highestJump[currentPlayer - 1] = Math.max(highestJump[currentPlayer - 1], playerHeights[currentPlayer - 1]);
            displayMessage(`Saut réussi à ${playerHeights[currentPlayer - 1]} cm !`);
            document.getElementById('attemptJump').style.display = 'none';
            document.getElementById('passHeight').style.display = 'none';
            if (currentTurn == maxTurns && currentPlayer==maxPlayers) {
                endGame(); 
                return; 
            }
            document.getElementById('nextPlayer').style.display = 'inline-block';
            attemptsLeft = 3;
            playerHeights[currentPlayer - 1] += 2; 
            updateHeight();
        } else {
            displayMessage(`Échec au saut à ${playerHeights[currentPlayer - 1]} cm.`);
            attemptsLeft--;

            if (attemptsLeft === 0) {
                document.getElementById('jumpResult').innerText = `Vous avez utilisé toutes vos tentatives pour ${playerHeights[currentPlayer - 1]} cm. Votre meilleur saut est ${highestJump[currentPlayer - 1]} cm.`;
                document.getElementById('result').style.display = 'block';
                document.getElementById('attemptJump').style.display = 'none';
                document.getElementById('passHeight').style.display = 'none';
                document.getElementById('heightContainer').style.display = 'none';
                if (currentTurn == maxTurns && currentPlayer==maxPlayers) {
                    endGame(); 
                    return; 
                }
                document.getElementById('nextPlayer').style.display = 'inline-block';
            }
        }
    } else {
        displayMessage("Vous avez déjà utilisé toutes vos tentatives pour cette hauteur.");
    }
});

document.getElementById('passHeight').addEventListener('click', function() {
    document.getElementById('attemptJump').style.display = 'none';
    document.getElementById('passHeight').style.display = 'none';
    if (currentTurn == maxTurns && currentPlayer==maxPlayers) {
        endGame(); 
        return; 
    }
    attemptsLeft = 3;
    playerHeights[currentPlayer - 1] += 2;
    updateHeight();
    document.getElementById('nextPlayer').style.display = 'inline-block';
});

document.getElementById("nextPlayer").addEventListener("click", function() {
    // Store the current player's score
    localStorage.setItem(`score_${playerNames[currentPlayer - 1]}`, highestJump[currentPlayer - 1]);

    currentPlayer++;

    if (currentPlayer > maxPlayers) {
        currentPlayer = 1;
        currentTurn++; 
        document.getElementById('currentTurn').innerText = currentTurn; // Update displayed turn

        if (currentTurn > maxTurns) {
            endGame(); 
            return; 
        }
    }

    // Update the name of the player and height, and continue the game
    document.getElementById("currentPlayerNameGame").textContent = playerNames[currentPlayer - 1];
    updateHeight(); 
    resetGame(); 
    document.getElementById('gameArea').style.display = 'block'; 
});


function resetGame() {
    attemptsLeft = 3;
    document.getElementById("attemptJump").style.display = "inline-block";
    document.getElementById("passHeight").style.display = "inline-block";
    document.getElementById('heightContainer').style.display = 'inline-block';

    document.getElementById("nextPlayer").style.display = "none";
    document.getElementById('diceRolls').innerText = "";
    document.getElementById('diceResult').innerText = "";
    document.getElementById('messageArea').innerText = "";
    document.getElementById('result').style.display = 'none';
}

function endGame() {
    // Loop through all players and save their scores to localStorage
    for (let i = 0; i < playerNames.length; i++) {
        localStorage.setItem(`score_${playerNames[i]}`, highestJump[i]);
    }

    // Optionally, you can also store the currentHeight and currentTurn if needed
    localStorage.setItem('finalCurrentTurn', currentTurn);

    document.getElementById('nextPlayer').style.display = 'none';

    document.getElementById('rankingButton').style.display = 'block';
}

document.getElementById('goToRanking').addEventListener('click', function() {
    window.location.href = 'results.html'; 
});