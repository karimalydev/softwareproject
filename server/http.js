const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');



app.use(cors());

app.use(bodyParser.json())


// N-Queens solver function
function isSafe(board, row, col, N) {
  // Check the row on the left side
  for (let i = 0; i < col; i++) {
    if (board[row][i]) {
      return false;
    }
  }

  // Check upper diagonal on the left side
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j]) {
      return false;
    }
  }

  // Check lower diagonal on the left side
  for (let i = row, j = col; i < N && j >= 0; i++, j--) {
    if (board[i][j]) {
      return false;
    }
  }

  return true;
}

function solveNQueensUtil(board, col, N, solutions) {
  if (col === N) {
    // If all queens are placed, add the solution
    solutions.push([...board.map((row) => [...row])]);
    return;
  }

  for (let i = 0; i < N; i++) {
    if (isSafe(board, i, col, N)) {
      board[i][col] = 1;

      solveNQueensUtil(board, col + 1, N, solutions);

      board[i][col] = 0; // Backtrack
    }
  }
}

function solveNQueens(N) {
  const board = Array.from({ length: N }, () => Array(N).fill(0));
  const solutions = [];

  solveNQueensUtil(board, 0, N, solutions);

  return solutions;
}

// Define the route to display N-Queens solutions
app.get("/", (req, res) => {
  res.send({"message": "Hello Group 7!"});
});

// Handle the form submission
app.get("/solutions", (req, res) => {
  const N = parseInt(req.query.queens_number);
  const solutions = solveNQueens(N);
  console.log(N, solutions);
  res.send(solutions);
});

// Start the server
if (require.main === module) {  // This checks if this file is the main module being executed
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

module.exports = app;
