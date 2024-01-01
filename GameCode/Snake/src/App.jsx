import { useState } from 'react'

import { useEffect, useRef } from "react";
import { randomIntFromInterval } from "./lib/utils";
import Board from './Board.jsx';
import Dispbox from './nav.jsx';
import TitleScreen from './titlescreen.jsx';
import './App.css'
import './Board.css'
import io from 'socket.io-client'
import Leaderboard from './leaderboard.jsx';
import LoadingScreen from './LoadingScreen.jsx';

const socket = io.connect(`http://192.168.0.4:3001`);
class Snake{
  constructor(list, cells, color, direction, portalStatus, score){
    this.list = list;
    this.cells = new Set(cells);
    this.color = color;
    this.direction = direction;
    this.portalStatus = portalStatus;
    this.score = score;
}
}

const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT'
}

const deathMessages = [
"You're snake food now!",
"Slithered into oblivion!",
"You've hiss-torically failed!",
"Sssssssorry, game over!",
"You've been coiled out!",
"Snake? Snake?! Snaaaaake!",
"You've been sssssssnuffed out!",
"You've bitten the dust!",
"You're one with the grass now!",
"You've been rattled and rolled!",
"You've been sssssssunk!",
"You've been hiss-terically defeated!",
"You've been sssssssilenced!",
"You've been ssssssswept away!",
"You've been sssssssnuffed!",
]



const BOARD_SIZE = 15;
const App = () => {
  const [gameStatus, setGameStatus] = useState("hidden");
  const [score, setScore] = useState(0);
  const [gameboard] = useState(createBoard(BOARD_SIZE));
  const [direction, setDirection] = useState(Direction.RIGHT) ;
  const directionRef = useRef(direction.RIGHT);
  const [snakes, setSnakes] = useState([]);
  const [snakeCells, setSnakeCells] = useState(new Set([]));
  const [foodCell, setFoodCell] = useState(null);
  const [teleportationCell, setTeleportationCell] =useState(0);
  const[title, setTitle] = useState("Welcome to Elite Snake");
  const [isLoading, setIsLoading] = useState(true);
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(false);
  const [foodShouldTeleport, setFoodShouldTeleport] = useState(false);
  const [color, setColor] = useState('#1C82BF');
  const [name, setName] = useState('Player');
  const [leaderboardlist, setLeaderboard] = useState([]); 

  
  let playerSnake;
  let playerID;
  
  socket.on('snakeID', (id, callback)=>{
    playerID = id;
    callback(`A player connected: {${playerID}}`)
   
  })
  const handleStart = (color, name) => {
    if(!isLoading){
    socket.emit('start');
    socket.emit('changeColor', color );
    if(color){
    setColor(color);
    }
    socket.emit('changeName', name);
    if(name){
    setName(name);
    }
    setGameStatus("visible");
    }
     };
   
  socket.on('updatePlayers', (backendplayers, totalSnakeCells) => {
    
    let newSnakeCells = {};
    totalSnakeCells.forEach((cellData) => {
        newSnakeCells[cellData.cell] = cellData.color;
    });

    for(const id in backendplayers){
      const backendPlayer = backendplayers[id];

      if(!snakes[id]){
        // Create a new Snake if it doesn't exist yet
        const cells = Array.isArray(backendPlayer.cells) ? backendPlayer.cells : [];
        snakes[id] = new Snake(backendPlayer.list, cells, backendPlayer.color, backendPlayer.direction, backendPlayer.portalStatus, backendPlayer.score);

      }
    }
  
    for(const id in snakes){
      if(!backendplayers[id]){
        // Delete the Snake if it doesn't exist in the backendplayers
        delete leaderboardlist[id];
        delete snakes[id];
      }
    }
 
    setIsLoading(false);
  
  
  });
  socket.on('updateGameState', (data) => {
    setSnakes(data.snakes);

    let newSnakeCells = {};
    data.totalSnakeCells.forEach((cellData) => {
        newSnakeCells[cellData.cell] = cellData.color;
    });
    setSnakeCells(newSnakeCells);
    

    setFoodCell(data.foodCell);
    setFoodShouldReverseDirection(data.foodShouldReverseDirection);  
    if(data.snakes[playerID]){
      playerSnake = data.snakes[playerID];
      directionRef.current = playerSnake.direction;
      if(playerSnake.score){
        setScore(playerSnake.score);
      }
      
    }
    let leaderboardArray = Object.keys(data.snakes).map((id) => {
      if (data.snakes[id].name) {
        return {
          id: id,
          name: data.snakes[id].name,
          score: data.snakes[id].score || 0
        };
      }
      return null;
    }).filter(item => item !== null); // filter out null values
    
    leaderboardArray.sort((a, b) => b.score - a.score); // sort in descending order of score
    
    let leaderboardlist = {};
    leaderboardArray.forEach(item => {
      leaderboardlist[item.id] = {
        name: item.name,
        score: item.score
      };
    });
    setLeaderboard(leaderboardlist);
    setTeleportationCell(data.teleportationCell);
    setFoodShouldTeleport(data.foodShouldTeleport);
    

});
socket.on('snake-death', () => {
    setTitle(deathMessages[randomIntFromInterval(0, deathMessages.length - 1)]);
    setScore(0);
    setGameStatus('hidden');
})
  

    

  socket.on('snakeReversed', (id) => {
    snakes[id].direction = getOppositeDirection(snakes[id].direction);
  });
  
  useEffect(() => {
    let touchStartX = null;
    let touchStartY = null;
  
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
  
    const handleTouchEnd = (e) => {
      let newDirection;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
  
      if (Math.abs(diffX) > Math.abs(diffY)) { // Most significant.
        if (diffX > 0) { // Swiped left.
          newDirection = Direction.LEFT;
        } else { // Swiped right.
          newDirection = Direction.RIGHT;
        }
      } else {
        if (diffY > 0) { // Swiped up.
          newDirection = Direction.UP;
        } else { // Swiped down.
          newDirection = Direction.DOWN;
        }
      }
      const OppositeDirection = getOppositeDirection(directionRef.current);
  
      if (newDirection && newDirection !== OppositeDirection) {
        setDirection(newDirection);
        directionRef.current = newDirection;
        socket.emit('changeDirection', { id: playerID, direction: newDirection });
      }
    };
    
  
    const handleKeydown = (e) => {
      const newDirection = getDirectionFromKey(e.key);
      const OppositeDirection = getOppositeDirection(directionRef.current);
  
      if (newDirection && newDirection !== OppositeDirection) {
        setDirection(newDirection);
        directionRef.current = newDirection;
        socket.emit('changeDirection', { id: playerID, direction: newDirection });
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };
  
    // Attach the handlers to the events
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
  
    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [playerID, setDirection, directionRef]);
   if(isLoading){
    return (
    <div className='App'>
    <LoadingScreen/>
    </div>
    )
   }
   else{
  return (
   
    <>
     
      <div className='App'>
     
        <div className="game-container">
        
          <>
          
           
            { <Leaderboard leaderboard={leaderboardlist}/>}
              <div className='board-and-title'>
              {gameStatus === "hidden" && <TitleScreen setGameStatus={setGameStatus} title={title} handleStart={handleStart} inputcolor={color} inputname={name} />}
              <div className="board">
                <Board 
                gameboard={gameboard} 
                snakeCells={snakeCells} 
                foodCell={foodCell} 
                teleportationCell={teleportationCell} 
                foodShouldReverseDirection={foodShouldReverseDirection} 
                foodShouldTeleport={foodShouldTeleport}
                />
              </div>
              </div>
              <div className='dispbox-container'>
                {/*Make the thing not visible when its playing, but render it anyway*/}
              {<Dispbox color = {color} score = {score} visib = {gameStatus}/>}  
        
              </div>
          </>
        </div>
       
      </div>
    </>
  )
      
}
}
const createBoard = BOARD_SIZE =>{
  let counter =1;
  const board = [];
  for(let row = 0; row < BOARD_SIZE; row++){
      const currentRow = []
      for (let col = 0; col < BOARD_SIZE; col++){
          currentRow.push(counter++);
      }
      board.push(currentRow);
  }
  return board;
}
const getDirectionFromKey = (key) =>{
 
  switch (key) {
      case 'w':
          return Direction.UP;
      case 's':
          return Direction.DOWN;
      case 'a':
          return Direction.LEFT;
      case 'd':
          return Direction.RIGHT;
      default:
          return ''; 
  }
}




const getOppositeDirection = direction => {
  if (direction === Direction.UP) return Direction.DOWN;
  if (direction === Direction.RIGHT) return Direction.LEFT;
  if (direction === Direction.DOWN) return Direction.UP;
  if (direction === Direction.LEFT) return Direction.RIGHT;
};

export default App