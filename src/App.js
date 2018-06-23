import React from "react";
import "./App.css";

import logo from "./logo.svg";

const initialState = {
  directionX: 1,
  directionY: 0,
  food: [5, 5],
  size: { x: 10, y: 10 },
  snake: [[0, 0]],
  velocity: 1000,
};

function getBoard({ snake, food, size }) {
  const board = [...Array(size.y)].map(() => {
    return [...Array(size.x)].map(() => {
      return "NOT_SNAKE";
    });
  });
  board[food[1]][food[0]] = "FOOD";
  snake.forEach(coords => {
    board[coords[1]][coords[0]] = "SNAKE";
  });
  return board;
}

const cellColors = {
  'SNAKE': 'green',
  'NOT_SNAKE': '#eee',
  'FOOD': 'red',
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SnakeCell = props => (
  <div 
    style={{
      display: 'inline-block',
      backgroundColor: cellColors[props.state],
      width: '30px',
      height: '30px',
      marginLeft: '1px',
      marginRight: '1px',
    }}
  />
);



class App extends React.Component {
  state = initialState;

  componentDidMount() {
    this.startSnake();
    this.listenForKeyChanges();
  }

  startSnake = () => {
    this.interval = setInterval(this.updateSnake, this.state.velocity);
  }

  listenForKeyChanges = () => {
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      switch(key) {
        case "ArrowLeft":
          console.log('moving left');
          this.setState({ directionX: -1, directionY: 0 });
          break;
        case "ArrowRight":
          console.log('moving right');
          this.setState({ directionX: 1, directionY: 0 });
          break;
        case "ArrowUp":
          console.log('moving up');
          this.setState({ directionX: 0, directionY: -1 });
          break;
        case "ArrowDown":
          console.log('moving down');
          this.setState({ directionX: 0, directionY: 1 });
          break;
        default:
          return;
      }
    });
  }

  render() {
    const board = this.getBoard();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to The Snake Game</h1>
        </header>
        <p className="App-intro">
          {board.map(row => (
            <div>
              {row.map(cell => <SnakeCell state={cell} />)}
            </div>
          ))}
        </p>
      </div>
    );
  }

  getNewHead = head => {
    return [head[0] + this.state.directionX, head[1] + this.state.directionY];
  };

  moveSnake = head => {
    const currentSnake = this.state.snake;
    const newSnakeWithTail = [head, ...currentSnake];
    const newSnake = newSnakeWithTail.slice(0, newSnakeWithTail.length - 1);
    this.setState({ snake: newSnake });
  };

  generateFood = () => {
    const randomX = getRandomInt(0, this.state.size.x);
    const randomY = getRandomInt(0, this.state.size.y);
    const board = this.getBoard();
    const foodState = board[randomY][randomX];
    if (foodState === 'NOT_SNAKE') {
      return [randomX, randomY];
    }
    return this.generateFood();
  };

  updateSpeed = () => {
    const newVelocity = this.state.velocity * 0.8;
    this.setState({ velocity: newVelocity }, () => {
      clearInterval(this.interval);
      this.startSnake();
    });
  }

  growSnake = head => {
    const currentSnake = this.state.snake;
    const newSnake = [head, ...currentSnake];
    this.setState({ snake: newSnake }, () => {
      const newFood = this.generateFood();
      this.setState({ food: newFood });
    });
    this.updateSpeed();
  };

  getBoard = () => {
    const board = getBoard({
      snake: this.state.snake,
      food: this.state.food,
      size: this.state.size
    });
    return board;
  }

  updateSnake = () => {
    const currentHead = this.state.snake[0];
    const newHead = this.getNewHead(currentHead);
    const board = this.getBoard();
    const newHeadState = board[newHead[1]][newHead[0]];
    switch (newHeadState) {
      case "SNAKE":
        throw new Error("Game over!");
      case "NOT_SNAKE":
        this.moveSnake(newHead);
        return;
      case "FOOD":
        this.growSnake(newHead);
        return;
      default:
        throw Error("Out of bounds!");
    }
  };
}

export default App;
