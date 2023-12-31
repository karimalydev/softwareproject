  <template>
  <div class="all">
    <!-- Landing section with title and start button -->
    <section class="landing">
      <div class="centered-content">
        <h1>Want To Play</h1>
        <!--slides the page down to the chess page-->
        <button @click="scrollToChessboard">Start</button>
      </div>
    </section>

    <!-- the page with the chessboard -->
    <section class="chessboard-section">
      <h2>N-Queens Solver</h2>
      <div class="content-container">
        <!-- Queen piece images on the left side of the container -->
        <div class="queens">
          <div class="queen-left">
            <img src="@/assets/queen-left.png" alt="Queen" class="queen-image" />
          </div>

          <!--middle part of the grid-->
          <div class="chessboard-container">
            <div class="form">
            <label for="queensInput">Enter the number of queens:</label>
            <input id="queensInput" type="number" v-model="nQueens" @input="updateChessboard">
            <div class="choice-counter">
              <h2>Remaining tries : {{score}}</h2>
            </div>
          </div>

          <h2>Solutions : {{ currentSolutionIndex + 1 }} / {{ totalSolutions }}</h2>
            <div class="chessboard">
                          <!-- this will let the user now if the cell selected is == solution cell-->
              <div v-for="(row, rowIndex) in chessboard" :key="rowIndex" class="row">
                <div
                  v-for="(square, colIndex) in row"
                  :key="colIndex"
                  :class="getSquareClass(rowIndex, colIndex)"
                  @click="cellClicked(rowIndex, colIndex)"
                >
                {{ square === 1 ? square : '' }}
                </div>
              </div>
            </div>

          </div>
          <!--right part of the container containingthe queen piece-->
          <div class="queen-right">
            <img src="@/assets/queen-right.png" alt="Queen" class="queen-image" />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios'

const nQueens = ref(4); // Default to 8 queens
const chessboardSize = ref(4); // Default board size
const chessboard = ref([]);
const allChessboard = ref([]);
let score = ref(3);
let totalSolutions = ref(0);
let currentSolutionIndex = ref(0);

function updateChessboard() {
  chessboardSize.value = nQueens.value;
}

// Initialize or reinitialize the chessboard grid when chessboardSize changes
watch(chessboardSize, () => {
  
  initializeChessboard();
});

function randomizeToOneAndTwo(matrix) {
    const positions = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                positions.push([i, j]);
            }
        }
    }

    if (positions.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * positions.length);
    const [randomRow, randomCol] = positions[randomIndex];

    for (let pos of positions) {
        const [row, col] = pos;
        if (row !== randomRow || col !== randomCol) {
            matrix[row][col] = 2;
        }
    }

    return matrix;
}

async function initializeChessboard() {
  score.value = 3;
  let response = await axios.get('http://localhost:3000/solutions?queens_number='+chessboardSize.value)
  if (response.data.length === 0) {
    alert('Oops! No solutions found for ' + chessboardSize.value + ' queens. Please try a different number.');
    return;
  }
  allChessboard.value = response.data;
  totalSolutions.value = response.data.length;
  currentSolutionIndex.value = 0;

  showChessboardData(currentSolutionIndex.value);
}

function showChessboardData(chessboardIndex) {
  let chessboardData = randomizeToOneAndTwo(allChessboard.value[chessboardIndex]);
  chessboard.value = [];
  for (let i = 0; i < chessboardSize.value; i++) {
    chessboard.value.push(chessboardData[i]);
  }
}

initializeChessboard(); // Initialize the chessboard initially

function getSquareClass(rowIndex, colIndex) {
  // Define CSS classes for styling the chessboard
  const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
  return {
    square: true,
    'black-square': isBlackSquare,
  };
}

function showSolution() {
  for (var i = 0; i < chessboardSize.value; i++) {
    for (var j = 0; j < chessboardSize.value; j++) {
        if (chessboard.value[i][j] == 2) {
            chessboard.value[i][j] = 1;
        }
    }
  }
}

function checkSolution() {
  for (var i = 0; i < chessboardSize.value; i++) {
    for (var j = 0; j < chessboardSize.value; j++) {
        if (chessboard.value[i][j] == 2) {
            return false;
        }
    }
  }
  return true;
}

function cellClicked(rowIndex, colIndex) {
  // Handle the click event for the chessboard cell
  if (chessboard.value[rowIndex][colIndex] == 2) {
    score.value++;
    chessboard.value[rowIndex][colIndex] = 1;

    if (checkSolution() && currentSolutionIndex.value == totalSolutions.value - 1) {
      alert('Awesome! You solved all the solutions!');
      return;
    }

    if (checkSolution()) {
      alert('Great job! Moving on to the next solution.');
      currentSolutionIndex.value += 1;
      showChessboardData(currentSolutionIndex.value);
    } else {
      alert('Nice move!');
    }
    
  } else {
    if (score.value == 0) {
      alert('Game Over! Better luck next time.');
      showSolution();
      // initializeChessboard();
      return;
    } else {
      score.value--;
      alert('Oops! Try a different square. Remaining tries: ' + score.value);
    }
  }
}

function scrollToChessboard() {
  // Scroll to the chessboard section
  const chessboardSection = document.querySelector('.chessboard-section'); 

  if (chessboardSection) {
    chessboardSection.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style scoped>
/* Styling for the landing section */
.all{
  background: linear-gradient(247deg, #BED9B9 0%, rgba(66.94, 209.87, 255, 0) 100%);
}
.landing {
  text-align: center;
  height: 100vh; /* Set the landing section to full viewport height */
  display: flex;
  align-items: center;
  background: linear-gradient(247deg, #054d49 0%, rgba(23, 86, 105, 0) 100%);
  justify-content: center;
}
.landing h1 {
  font-size: 180px;
  margin-bottom: 20px;
  color: white;
}

/* Styling for the start button */
.landing button {
  background-color:slategray;
  color: aliceblue;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 60px;
  cursor: pointer;
}

.centered-content {
  text-align: center;
}


/* styling for the chessboard Page */
.chessboard-section {
  text-align: center;
  
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chessboard-section h2 {
  font-size: 40px;
  margin-bottom: 20px;
}


.content-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Styling for the chessboard container and queen images */
.chessboard-container {
  text-align: center;
  
  min-height: 100vh; /* Set the height to 100% of the viewport height */
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

.chessboard-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
.form{
  padding-bottom: 120px;

}
.form label{
  font-size: 20px;
}
.form input{
  font-size: 20px;
  color:cornsilk;
  background-color:slategray;
  border-radius: 20px;
}


/* Add your styles here */
.chessboard {
  display: grid;
  grid-template-columns: repeat(var(--boardSize), 30px);
  gap: 2px;
}

.row {
  display: flex;
}

.square {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer; /* Add a pointer cursor to indicate clickability */
}

.black-square {
  background-color:blueviolet;
}

/* Styling for the queen piece images */
.queens {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  
  width: 60%; /* Set the width to 60% of the page */
  margin: 0 auto; /* Center horizontally within the parent section */
}

.queen-left,
.queen-right {
  width: 15%; /* Each queen takes 15% of the section width */
  display: flex;
  align-items: center;
  height: 1000px;
}

.queen-left {
  justify-content: flex-end; /* Align the left queen to the right */
}

.queen-right {
  justify-content: flex-start; /* Align the right queen to the left */
}

.queen-image {
  height: 40%; /* Set the image height to 100% of the chessboard section */
  width: auto; /* Auto width to maintain aspect ratio */
}
</style>