// Card variables
let suits = ['Hearts','Clubs','Diamonds','Spades'];
let values = ['Ace','King','Queen','Jack',
              'Ten','Nine','Eight','Seven',
              'Six','Five','Four','Three','Two'];

// DOM variables
let paraText = document.getElementById("para-id");
let newGameButton = document.getElementById("new-game-id");
let hitButton = document.getElementById("hit-id");
let stayButton = document.getElementById("stay-id");

// Game variables
let gameStarted = false,
    gameOver = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [],
    winMessage = "";

hitButton.style.display = 'none';
stayButton.style.display = 'none';

newGameButton.addEventListener('click',function()
{
  gameStarted = true;
  gameOver = false;
  
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(),getNextCard()];
  playerCards = [getNextCard(),getNextCard()];
  
  updateScores(); // To check for Blackjack
  if(playerScore === 21)
  {
    winMessage = "YOU WIN WITH BLACKJACK !!";
    gameOver = true;
    showStatus();
    return;
  }
  if(dealerScore === 21)
  {
    winMessage = "DEALER WIN WITH BLACKJACK !!";
    gameOver = true;
    showStatus();
    return;
  }
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click',function()
{
  playerCards.push(getNextCard());
  checkForGameOver();
  showStatus();
});

stayButton.addEventListener('click',function()
{
  gameOver = true;
  checkForGameOver();
  showStatus();
});

function createDeck()
{
  let deck = [];
  for(let suitsId = 0; suitsId < suits.length; suitsId++)
  {
    for(let valuesId = 0; valuesId < values.length; valuesId++)
    {
      let card = {
        suit : suits[suitsId],
        value : values[valuesId]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck)
{
  for(let i = 0; i < deck.length; i++)
  {
    let swapId = Math.trunc(Math.random()*deck.length);
    let temp = deck[swapId];
    deck[swapId] = deck[i];
    deck[i] = temp;
  }
}

function getNextCard()
{
  return deck.shift();
}

function updateScores()
{
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function getScore(cardDeck)
{
  let score = 0;
  let hasAce = false;
  for(let i = 0; i < cardDeck.length; i++)
  {
    let card = cardDeck[i];
    score += getCardNumericValue(card);
    if(card.value === 'Ace')
      hasAce = true;
  }
  if(hasAce && score+10 <= 21)
    return score+10;
  return score;
}

function getCardNumericValue(card)
{
  switch(card.value)
  {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function showStatus()
{
  if(!gameStarted)
  {
    paraText.innerText = "Welcome to Blackjack!!";
    return ;
  }
  
  let dealerCardString = "";
  for(let i = 0; i < dealerCards.length; i++)
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  
  let playerCardString = "";
  for(let i = 0; i < playerCards.length; i++)
    playerCardString += getCardString(playerCards[i]) + '\n';
  
  updateScores();
  
  paraText.innerText =
      'Dealer has :\n' +
      dealerCardString +
      "(score : " + dealerScore + ")\n\n" +
      
      'Player has :\n' +
      playerCardString +
      "(score : " + playerScore + ")\n\n";
  
  if(gameOver)
  {
    paraText.innerText += winMessage;
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none'
  }
}

function getCardString(card)
{
  return card.value + " of " + card.suit;
}

function checkForGameOver()
{
  updateScores();
  if(playerScore === 21)
  {
	if(dealerScore === 21)
		winMessage = "TIE GAME !!";
	else
		winMessage = "YOU WIN !!!";
    gameOver = true;
    return;
  }
  if(playerScore > 21)
  {
    winMessage = "DEALER WIN";
    gameOver = true;
    return;
  }
  if(gameOver)
  {
    while(dealerScore <= playerScore &&
          dealerScore <= 21 && 
          playerScore <= 21)
    {
      dealerCards.push(getNextCard());
      updateScores();
    }
    if(dealerScore === playerScore)
    {
      winMessage = "TIE GAME";
      return;
    }
    if(dealerScore === 21 || (dealerScore < 21 && dealerScore > playerScore))
    {
      winMessage = "DEALER WIN";
      return;
    }
    if(dealerScore > 21 || dealerScore < playerScore)
    {
      winMessage = "YOU WIN !!!";
      return;
    }
    return;
  }
}
