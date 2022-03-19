const DEFAULT_HEIGHT = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

const getWater = (height, grid) => {
  let waterArea = 0;
  let currentRow = 1;
  const yMax = Math.max(...height);

  while (currentRow <= yMax) {
    let waterInRow = 0;
    let trapStart = height.findIndex((columnHeight) => columnHeight >= currentRow);

    for (let i = trapStart + 1; i < height.length; i++) {
      if (height[i] >= currentRow) {
        const waterLength = i - trapStart - 1;
        waterInRow += waterLength;

        if (grid && waterLength > 0) {
          const invertedCurrentRow = yMax - currentRow;

          // Get water coordinates
          for (let x = i - waterLength; x < i; x++) {
            grid[invertedCurrentRow][x] = 2;
          }
        }
        trapStart = i;
      }
    }

    currentRow++;
    waterArea += waterInRow;
  }

  return [waterArea, grid];
}

// empty - 0; wall - 1; water - 2

const hydrateWithWalls = (height) => {
  let currentRow = 0;
  const yMax = Math.max(...height);
  const grid = Array.from({ length: yMax }, () => Array.from({ length: height.length }, () => 0));

  while (currentRow < yMax) {
    for (let i = 0; i < height.length; i++) {
      const invertedCurrentRow = yMax - currentRow - 1;
      if (height[i] > currentRow) {
        grid[invertedCurrentRow][i] = 1;
      } else {
        grid[invertedCurrentRow][i] = 0;
      }
    }

    currentRow++;
  }

  return grid;
}

const generate = (height) => {
  const grid = hydrateWithWalls(height);
  return getWater(height, grid);
}

const trap = (height) => {
  const [water] = getWater(height);
  return water;
}

const drawScreen = (height) => {
  const [waterArea, grid] = generate(height);
  const table = document.querySelector('#grid');
  const waterAreaText = document.querySelector('#water-area');

  waterAreaText.innerText = `Water Area: ${waterArea}`;


  table.replaceChildren("")

  for (let i = 0; i < grid.length; i++) {
    const row = table.insertRow();
    for (let j = 0; j < grid[i].length; j++) {
      const cell = row.insertCell();

      switch (grid[i][j]) {
        case 1:
          cell.style.backgroundColor = 'black';
          break;
        case 2:
          cell.style.backgroundColor = '#2596be';
          break;
        default:
          break;
      }
    }
  }
}

window.onload = () => {
  const generateBtn = document.querySelector('#generate-grid');

  drawScreen(DEFAULT_HEIGHT);

  generateBtn.addEventListener('click', () => {
    const height = Array.from({ length: Math.floor(Math.random() * 10) + 4 }, () => Math.floor(Math.random() * 6));
    drawScreen(height);
  })
}
