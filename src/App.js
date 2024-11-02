import React, { useState } from 'react';
import axios from 'axios';
import GridInput from './GridInput';
import './App.css';

function App() {
  const [user1Grid, setUser1Grid] = useState(Array(3).fill(Array(3).fill('')));
  const [user2Grid, setUser2Grid] = useState(Array(3).fill(Array(3).fill('')));
  const [generatedNumber, setGeneratedNumber] = useState(null);
  const [crossedNumbers, setCrossedNumbers] = useState({ user1: [], user2: [] });
  const [winner, setWinner] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);

  const hasDuplicateNumbers = (grid) => {
    const allNumbers = grid.flat();
    const uniqueNumbers = new Set(allNumbers);
    return uniqueNumbers.size !== allNumbers.length;
  };

  const startGame = async () => {
    if (!user1Grid.flat().every(num => num) || !user2Grid.flat().every(num => num)) {
      alert("Please fill in all cells before starting the game.");
      return;
    }
    if (hasDuplicateNumbers(user1Grid) && hasDuplicateNumbers(user2Grid)) {
      alert("Both grids have duplicate numbers.");
      return;
    }
    if (hasDuplicateNumbers(user1Grid)) {
      alert('User 1 grid has duplicate numbers. Please ensure all numbers are unique.');
      return;
    }
    if (hasDuplicateNumbers(user2Grid)) {
      alert('User 2 grid has duplicate numbers. Please ensure all numbers are unique.');
      return;
    }
    try {
      await axios.post('https://el-lotteria-game.onrender.com/api/start-game', { user1Grid, user2Grid });
      alert('Game Started');
      setWinner(null);
      setGeneratedNumber(null);
      setCrossedNumbers({ user1: [], user2: [] });
      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  // Function to check if all elements in an array are in crossedNumbers
  const isLineCrossed = (line, crossedNumbers) => line.every(num => crossedNumbers.includes(num));

  // Function to check for a win by verifying rows, columns, and diagonals
  const checkWinCondition = (grid, crossedNumbers) => {
    const rows = grid;
    const columns = [0, 1, 2].map(i => grid.map(row => row[i]));  // Extract columns
    const diagonals = [
      [grid[0][0], grid[1][1], grid[2][2]], // Top-left to bottom-right
      [grid[0][2], grid[1][1], grid[2][0]], // Top-right to bottom-left
    ];

    // Check each row, column, and diagonal
    return [...rows, ...columns, ...diagonals].some(line => isLineCrossed(line, crossedNumbers));
  };

  const generateNumber = async () => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('https://el-lotteria-game.onrender.com/api/generate-number');
        const newNumber = response.data.number;
        setGeneratedNumber(newNumber);

        setCrossedNumbers(prevState => {
          const updatedUser1 = [...prevState.user1, newNumber];
          const updatedUser2 = [...prevState.user2, newNumber];

          // Check for a win for each user
          const user1Wins = checkWinCondition(user1Grid, updatedUser1);
          const user2Wins = checkWinCondition(user2Grid, updatedUser2);

          // console.log("User 1 Wins:", user1Wins);
          // console.log("User 2 Wins:", user2Wins);

          if (user1Wins && user2Wins) {
            setWinner("Game Draw!");
            setGameStarted(false);
            clearInterval(interval);
          } else if (user1Wins) {
            setWinner("User 1 Wins!");
            setGameStarted(false);
            clearInterval(interval);
          } else if (user2Wins) {
            setWinner("User 2 Wins!");
            setGameStarted(false);
            clearInterval(interval);
          }

          return {
            user1: updatedUser1,
            user2: updatedUser2,
          };
        });
      } catch (error) {
        console.error('Error generating number:', error);
        clearInterval(interval);
      }
    }, 1000); // Adjust the interval as needed
  };




  const resetGame = () => {
    setUser1Grid(Array(3).fill(Array(3).fill('')));
    setUser2Grid(Array(3).fill(Array(3).fill('')));
    setGeneratedNumber(null);
    setCrossedNumbers({ user1: [], user2: [] });
    setWinner(null);
    setGameStarted(false);
  };

  return (
    <div className="game-container">
      <h1>El Lotteria Game</h1>
      <div className="grids-container">
        <GridInput grid={user1Grid} setGrid={setUser1Grid} player="User 1" crossedNumbers={crossedNumbers.user1} gameStarted={gameStarted} />
        <GridInput grid={user2Grid} setGrid={setUser2Grid} player="User 2" crossedNumbers={crossedNumbers.user2} gameStarted={gameStarted} />
      </div>
      <div className="controls">
        <button onClick={startGame} disabled={gameStarted}>Start Game</button>
        <button onClick={generateNumber} disabled={!gameStarted || winner !== null}>Generate Number</button>
        {winner && <button onClick={resetGame}>Reset Game</button>}
        <h2>Generated Number: {generatedNumber}</h2>
        {winner && <h2>{winner} </h2>}
      </div>
    </div>
  );
}

export default App;
