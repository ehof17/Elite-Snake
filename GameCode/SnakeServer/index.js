require('dotenv').config();
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors');
app.use(cors());
const server = http.createServer(app)
const { Server } = require('socket.io')


const io = new Server(server, {
  cors: {
    origin: `http://${process.env.SERVER_IP}:3000`,
    methods: ["GET", "POST"],
  },
  pingInterval: 2000,
  pingTimeout: 5000
});



const { randomIntFromInterval, reverseLinkedList} = require('./lib/utils');

// Define classes
class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}


// Initialize constants
const Direction = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT'
}
const BOARD_SIZE = 15;
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = .3;
const PROBABILITY_OF_TELEPORTATION_FOOD = .3;

// Initialize variables
let score = 0;
let gameSpeed = 120;
let SnakeCells = {};
let foodCell = 16;
let teleportationCell = 225;

let NextTeleportationCell = null;
let foodShouldReverseDirection = false;
let foodShouldTeleport = true;
let totalSnakeCells = {};
let snakes = {};

// Create express app and server
// Define helper functions
const createBoard = BOARD_SIZE => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = []
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
}

const getStartingSnakeLLValue = board => {
  const rowSize = board.length;
  const colSize = board[0].length;
  const startingRow = Math.round(rowSize / 3);
  const startingCol = Math.round(colSize / 3);
  const startingCell = board[startingRow][startingCol];
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell,
  };
};

const board = createBoard(BOARD_SIZE)

// Handle new connections
io.on("connection", (socket) => {
    console.log(snakes)
    // Initialize new snake for the connected client
    let startingPosition = getStartingSnakeLLValue(board);
    let startingCell = Array.from(startingPosition.cell);
    snakes[socket.id] = {
      list: new SinglyLinkedList(startingPosition),
      cells: startingCell,
      color: "#1C82BF",
      direction: Direction.RIGHT,
      started: false,
      portalStatus: {
        passedPortal: false,
        touchedPortal: false,
        nextPortal: false,
      },
      score: 0,
    
    };
   
  
    // Add the new snake's cells to the total cells
    snakes[socket.id].cells.forEach(cell => totalSnakeCells[cell] = snakes[socket.id].color);
  
    // Send the client their snake ID
    socket.emit("snakeID", socket.id, (response) => {
      console.log(response);
    });
    
  
    // Convert totalSnakeCells to an array of objects
    let totalSnakeCellsArray = Object.keys(totalSnakeCells).map(cell => ({
    cell: cell,
    color: totalSnakeCells[cell]
  }));
    // Update all clients with the new game state
    io.emit('updatePlayers', snakes, totalSnakeCellsArray);
  
    // Handle direction change requests from clients
    socket.on('changeDirection', (data) => {
      const { id, direction } = data;
      if (snakes[id]) {
        snakes[id].direction = direction;
      }
    });
    socket.on('changeColor', (color) => {
      if (snakes[socket.id]) {
        snakes[socket.id].color= color;
      }
    })
    

    socket.on('changeName', (name) => {
      if (snakes[socket.id]) {
        snakes[socket.id].name= name;
      }})
    
    socket.on('start', () => {
        if (snakes[socket.id]) {
          snakes[socket.id].started = true;
        }
      
    });
  
  
  
    // Handle client disconnections
    socket.on("disconnect", (reason) => {
      console.log(reason);
      
      handleSnakeDeath(socket.id);
      delete snakes[socket.id];
      let totalSnakeCells = Object.entries(SnakeCells).map(([cell, color]) => ({ cell, color }));
      io.emit('updateGameState', {snakes: snakes, totalSnakeCells: totalSnakeCells, foodCell: foodCell});
    });
  });
  
  // Move the snakes every second and update all clients with the new game state
 setInterval(() => {
   moveSnakes();
    let totalSnakeCells = Object.entries(SnakeCells).map(([cell, color]) => ({ cell, color }));
  
    io.emit('updateGameState', {snakes: snakes, totalSnakeCells: totalSnakeCells, foodCell: foodCell, foodShouldReverseDirection: foodShouldReverseDirection, foodShouldTeleport: foodShouldTeleport, teleportationCell: teleportationCell });
}, gameSpeed);

server.listen(3001, () =>{
    console.log("SERVER IS RUNNING")
  
})

const moveSnakes = () => {
  
    Object.entries(snakes).forEach(([socketId, snake]) => {
      if (snakes[socketId].started){  
      const currentHeadCoords = {
        row: snake.list.head.value.row,
        col: snake.list.head.value.col,
      };
  
      let nextHeadCoords = getCoordsInDirection(currentHeadCoords, snake.direction);
   
      if (isOutOfBounds(nextHeadCoords, board)) {
        handleSnakeDeath(socketId);
        io.to(socketId).emit('snake-death', snake.color);
        return;
      }
  
      const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
  
      if (nextHeadCell in SnakeCells) {
        handleSnakeDeath(socketId);
        io.to(socketId).emit('snake-death',  snake.color);
        return;
      }

      
    
    if(teleportationCell != 0){
      if(nextHeadCell ===teleportationCell){
        snake.portalStatus.nextPortal = true
        NextTeleportationCell = teleportationCell
        let RC = getRC(foodCell)
        
        nextHeadCoords = {row: RC.row, col: RC.col}
        
      }
      if(nextHeadCell === foodCell){
        let RC = getRC(teleportationCell)
        snake.portalStatus.nextPortal = true
        NextTeleportationCell = foodCell
  
        nextHeadCoords = {row: RC.row, col: RC.col}
      }
    }
    
    if(snake.portalStatus.nextPortal){
      handleGoingThroughTeleport(NextTeleportationCell, snake);            
    }

      const newHead = new LinkedListNode({
        row: nextHeadCoords.row,
        col: nextHeadCoords.col,
        cell: nextHeadCell,
      });

      let newSnakeCells = new Set(snake.cells);
      let newTotalSnakeCells = { ...SnakeCells };

      const currentHead = snake.list.head;
      snake.list.head = newHead;
      currentHead.next = newHead;

      newSnakeCells.delete(snake.list.tail.value.cell);
      newSnakeCells.add(nextHeadCell);

      delete newTotalSnakeCells[snake.list.tail.value.cell];
      newTotalSnakeCells[nextHeadCell] = snake.color;

      snake.list.tail = snake.list.tail.next;
      if (snake.list.tail === null) snake.list.tail = snake.list.head;

        if(snake.portalStatus.passedPortal){
        handleFoodConsumption(newSnakeCells);
        snake.portalStatus.touchedPortal = false;
        snake.portalStatus.passedPortal= false;
        snake.portalStatus.nextPortal =false;
            }

        

      const foodConsumed = nextHeadCell === foodCell;
      if (foodConsumed) {
        growSnake(newSnakeCells, snake);
        snakes[socketId].score +=1;
        
    
        if (!foodShouldTeleport) {
          if (foodShouldReverseDirection) reverseSnake(snake);
          handleFoodConsumption(newSnakeCells);
          newSnakeCells.add(snake.list.head.value.cell);
          newTotalSnakeCells[snake.list.head.value.cell] = snake.color;

        }
      
      }
  
      const teleportFoodConsumed = nextHeadCell === teleportationCell;
      if (teleportFoodConsumed) {
        growSnake(newSnakeCells, snake);
        snakes[socketId].score +=1;
       
      }

      SnakeCells = newTotalSnakeCells;
    

      snake.cells = newSnakeCells;
      snakes[socketId].cells = newSnakeCells;
      snakes[socketId].list = snake.list;
      snakes[socketId].direction = snake.direction;
      
}});  
  };
  
  const growSnake = (newSnakeCells, snake) => {
   
    const growthNodeCoords = getGrowthNodeCoords(snake.list.tail, snake.direction);


    if (isOutOfBounds(growthNodeCoords, board) && !foodShouldTeleport) {
      return;
    }



    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell,
    });
  
    const currentTail = snake.list.tail;
    snake.list.tail = newTail;
    snake.list.tail.next = currentTail;
    newSnakeCells[newTailCell] = snake.color;
  };
    const reverseSnake = (snake) => {
        const tailNextNodeDirection = getNextNodeDirection(snake.list.tail, snake.direction);
        const newDirection = getOppositeDirection(tailNextNodeDirection);
        snake.direction=newDirection;
        
        
        reverseLinkedList(snake.list.tail);
        const snakeHead = snake.list.head;
        snake.list.head = snake.list.tail;
        snake.list.tail = snakeHead;
        
    }
    
    
    
    
    const generateNewCell = (maxCellVal, excludedCells) => {
        let newCell;
        do {
          newCell = randomIntFromInterval(1, maxCellVal);
        } while (newCell in excludedCells);
        return newCell;
      };
      
      const handleFoodConsumption = () => {
        const maxCellVal = BOARD_SIZE * BOARD_SIZE;
        const excludedCells = { ...SnakeCells, [foodCell]: true };
      
        // Generate the next food cell
        const nextFoodCell = generateNewCell(maxCellVal, excludedCells);
      
        // Determine the type of the next food
        const nextFoodShouldReverseDirection = Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;
        const nextFoodShouldTeleport = Math.random() < PROBABILITY_OF_TELEPORTATION_FOOD;
      
        // Reset the food properties
        teleportationCell = 0;
        foodShouldReverseDirection = false;
        foodShouldTeleport = false;
      
        if (nextFoodShouldTeleport) {
          // Generate the second food cell for teleportation
          excludedCells[nextFoodCell] = true;
          const secondFoodCell = generateNewCell(maxCellVal, excludedCells);
      
          foodShouldTeleport = nextFoodShouldTeleport;
          teleportationCell = secondFoodCell;
        } else {
          foodShouldReverseDirection = nextFoodShouldReverseDirection;
        }
      
        // Update the food cell and score
        foodCell = nextFoodCell;
       
      };
    
    
   
    const handleSnakeDeath = (id) => { 
     
        // Get the cells of the dead snake
        snakes[id].score = 0;
        const deadSnakeCells = snakes[id].cells;
      
        // Remove each cell of the dead snake from SnakeCells
        Object.keys(deadSnakeCells).forEach(cell => delete SnakeCells[cell]);
      
        let temp = snakes[id].list.tail;
        while(temp != null){
          delete SnakeCells[temp.value.cell];
          temp = temp.next;
        }
      
        
        
        snakes[id].list = new SinglyLinkedList(getStartingSnakeLLValue(board));
        snakes[id].cells = new Set([snakes[id].list.head.value.cell]);
        snakes[id].direction = Direction.RIGHT;
        snakes[id].started = false;
        snakes[id].portalStatus.passedPortal = false;
        snakes[id].portalStatus.touchedPortal = false;
        snakes[id].portalStatus.nextPortal = false;
        snakes[id].score = 0;

        
    }
    
    const handleGoingThroughTeleport = (cell, snake) =>{
      if(!snake.portalStatus.touchedPortal){
      let temp = snake.list.tail
      while (temp!=null && temp.next != null){
    
        if(temp.next.value.cell ===cell){
            //if it ever equals it, dont handle food consumption.
            snake.portalStatus.touchedPortal = true
            
            break;
    
        }
        temp = temp.next
    }
    }
    
    if(snake.portalStatus.touchedPortal){
     //if we touched the portal previously, and no cells from tail to head equal the cell, then we are all goo
     let temp = snake.list.tail
     let snakeInPortal = false
     while(temp!= null){
      if(temp.value.cell === cell){
        
        //If this is true for whole linked list, set the other ting
        snakeInPortal = true
      }
      
      temp = temp.next
     }
     if(!snakeInPortal) {
      snake.portalStatus.passedPortal = true
     }
    
    }
    }
  
    
    const getCoordsInDirection = (currentHeadCoords, direction) =>{
        switch (direction) {
            case Direction.UP:
                return {
                    row: currentHeadCoords.row - 1,
                    col: currentHeadCoords.col
                };
            case Direction.RIGHT:
                return {
                    row: currentHeadCoords.row,
                    col: currentHeadCoords.col + 1
                };
            case Direction.DOWN:
                return {
                    row: currentHeadCoords.row + 1,
                    col: currentHeadCoords.col
                };
            case Direction.LEFT:
                return {
                    row: currentHeadCoords.row,
                    col: currentHeadCoords.col - 1
                };
        }
    }
    function isOutOfBounds(coords, board) {
        const { row, col } = coords;
        const boardSize = board.length; // Assuming the board is a square
      
        return row < 0 || col < 0 || row >= boardSize || col >= boardSize;
      }
 
    
    
    const getNextNodeDirection = (node, currentDirection) => {
        if (node.next === null) return currentDirection;
        const {row: currentRow, col: currentCol} = node.value;
        const {row: nextRow, col: nextCol} = node.next.value;
        if (nextRow === currentRow && nextCol === currentCol +1) return Direction.RIGHT
        if (nextRow === currentRow && nextCol === currentCol -1) return Direction.LEFT
        if (nextCol === currentCol && nextRow === currentRow +1) return Direction.DOWN
        if (nextCol === currentCol && nextRow === currentRow -1) return Direction.UP  
        return currentDirection
    
    }
    const getGrowthNodeCoords = (snakeTail, currentDirection) => {
      const tailNextNodeDirection = getNextNodeDirection(snakeTail, currentDirection);
      const currentTailCoords = {
        row: snakeTail.value.row,
        col: snakeTail.value.col,
      };
   
    
      //if the row is 0, amd the direction is up, then grow down
      //if the row is 0, and the direction is down, grow down
      if (currentTailCoords.row <=0 && tailNextNodeDirection === Direction.DOWN) {

     
        return getCoordsInDirection(currentTailCoords, Direction.DOWN);
      }
      if (currentTailCoords.row === BOARD_SIZE - 1 && tailNextNodeDirection === Direction.UP) {
 
    
        return getCoordsInDirection(currentTailCoords, Direction.UP);
      }
      if (currentTailCoords.col === -1 && tailNextNodeDirection === Direction.RIGHT) {
   
   
        return getCoordsInDirection(currentTailCoords, Direction.RIGHT);
      }
      if (currentTailCoords.col === BOARD_SIZE-1  && tailNextNodeDirection === Direction.LEFT) {
      
    
        return getCoordsInDirection(currentTailCoords, Direction.LEFT);
      }
    
      // If the tail is not on the edge of the board, grow in the opposite direction of the next node
      const growthDirection = getOppositeDirection(tailNextNodeDirection);
   
     
      return getCoordsInDirection(currentTailCoords, growthDirection);
    };
    const getOppositeDirection = direction => {
        if (direction === Direction.UP) return Direction.DOWN;
        if (direction === Direction.RIGHT) return Direction.LEFT;
        if (direction === Direction.DOWN) return Direction.UP;
        if (direction === Direction.LEFT) return Direction.RIGHT;
      };

      const getRC = (Number) => {
        let adjustedNumber = Number - 1;
        let row = Math.floor(adjustedNumber /BOARD_SIZE)
        let col = Math.floor(adjustedNumber % BOARD_SIZE)
        let val = Number
        return {row, col, val}
      }

