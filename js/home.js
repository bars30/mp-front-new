window.onload = function() {
  
    const token = localStorage.getItem('token');
    const inputs = document.querySelectorAll('.cell');
    const signOutButton = document.querySelector('.signOutButton');
    const notification = document.querySelector('.notification');
    const toolbarCont = document.querySelector('.toolbar-cont');
  
    localStorage.removeItem('registerPassword');
    if (!token) {
      inputs.forEach(input => input.disabled = true);
      signOutButton.hidden = true;
      signOutButton.style.opacity = 0;
      signOutButton.style.pointerEvents = 'none';
      toolbarCont.style.display = "none";
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';
    } else {
      notification.style.display = "none";
      notification.style.opacity = 0;
      const email = localStorage.getItem('email') || localStorage.getItem('registerEmail');
      document.querySelector('.email').innerText = `${email}`;
    }
  };
  
  async function refreshAccessToken() {
    try {
        const response = await fetch('http://localhost:3000/refresh-token', {
            method: 'POST',
            credentials: 'include', // Включает отправку cookie в запросе
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('New Access Token:', data.accessToken);

        localStorage.setItem('token', data.accessToken);

        return data.accessToken;
    } catch (error) {
        console.error('Failed to refresh token:', error.message);
        signOut();
    }
}


function refresh(){

  refreshAccessToken()
} 


  function signOut() {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',  
    })
    .then(response => {
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.clear();
        window.location.href = './index.html';
      } else {
        throw new Error('Logout failed');
      }
    })
    .catch(error => {
      console.error(error.message);
    });
  }
  
  
  let rowCount = 2;
  let colCount = 7; 
  const cellFormulas = {};
  let activeFormulaCell = null;
  let lastDValue = 100;
  let lastEValue = 1;
  let lastFValue = 600;

  function getDValues() {
    const dValues = [];
    for (let row = 2; row <= rowCount; row++) {
      const dCell = document.getElementById(`D${row}`);
      if (dCell) {
        const value = parseFloat(dCell.value.trim()) || 0; 
        dValues.push(value);
      }
    }
    
    return dValues;
  }

  function getEValues() {
    const eValues = [];
    for (let row = 2; row <= rowCount; row++) {
      const eCell = document.getElementById(`E${row}`);
      if (eCell) {
        const value = parseFloat(eCell.value.trim()) || 0; 
        eValues.push(value);
      }
    }
    
    return eValues;
  }

  async function fetchGValues() {
    const valuesD = getDValues();
    const valuesE = getEValues();
    const token = localStorage.getItem('token');

  
    if (!token) {

      const gValues = [101, 203.01, 306.0401, 410.100501, 515.20150601, 621.3535210701, 728.567056280801, 836.852726843609, 946.2212541120451, 1056.6834666531656, 1168.2503013196972, 1280.9328043328942, 1394.742132376223, 1509.6895536999853, 1625.7864492369852, 1743.044313729355, 1861.4747568666487, 1981.0895044353151, 2101.900399479668, 2223.9194034744646, 2347.1585975092094, 2471.6301834843016, 2597.3464853191444, 2724.3199501723357, 2852.563149674059, 2982.0887811707994, 3112.9096689825074, 3245.0387656723324, 3378.4891533290556, 3513.2740448623463, 3649.4067853109696, 3786.9008531640793, 3925.76986169572, 4066.027560312677, 4207.6878359158045, 4350.764714274963, 4495.272361417712, 4641.22508503189, 4788.637335882208, 4937.523709241031, 5087.898946333441];
      const interestValues = [1, 2.0100000000000002, 3.0301, 4.060401, 5.101005010000001, 6.1520150601, 7.213535210701, 8.28567056280801, 9.368527268436091, 10.462212541120453, 11.566834666531657, 12.682503013196973, 13.809328043328943, 14.94742132376223, 16.096895536999853, 17.25786449236985, 18.43044313729355, 19.614747568666488, 20.810895044353153, 22.01900399479668, 23.239194034744646, 24.471585975092093, 25.716301834843016, 26.973464853191444, 28.243199501723357, 29.52563149674059, 30.820887811707994, 32.129096689825076, 33.45038765672332, 34.784891533290555, 36.132740448623466, 37.4940678531097, 38.869008531640795, 40.2576986169572, 41.66027560312678, 43.076878359158044, 44.50764714274963, 45.952723614177124, 47.4122508503189, 48.886373358822084, 50.37523709241031];

      updateGCells(gValues);       
      updateInterestCells(interestValues); 
    } else {
      
    try {
      const response = await fetch('http://localhost:3000/calculateGValues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({
          dValues: valuesD,
          rateValue: valuesE,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        refresh();
        fetchGValues();
        console.error('Error:', errorData);
        return;
      }
  
      const { gValues, interestValues } = await response.json();
  

      updateGCells(gValues);       
      updateInterestCells(interestValues); 
    } catch (error) {
      console.error(error.message);
    }
    }

  }
  


  function updateInterestCells(interestValues) {
    interestValues.forEach((interest, index) => {
      const interestCell = document.getElementById(`F${index + 2}`);
      interestCell.value = interest.toFixed(2); 
    });
  }
  
  
  
  function getColumnValues(column) {
    const values = [];
    for (let row = 2; row <= rowCount; row++) {
      const cell = document.getElementById(`${column}${row}`);
      if (cell) { 
        values.push(parseFloat(cell.value) || 0);
      } 
    }
    return values;
  }
  
  
  function getRateValue() {
    return parseFloat(document.getElementById('customRate').value) || 0.1;
  }  

  function updateGCells(gValues) {
    if (Array.isArray(gValues)) {
      gValues.forEach((gValue, index) => {
        const gCell = document.getElementById(`G${index + 2}`); 
        if (gCell) {
          gCell.value = gValue.toFixed(2); 
        }
      });
    } else {
      return;
    }
  }
  

  
  function createCell(rowNumber, colLetter) {
    const cell = document.createElement('input');
    cell.type = 'number';
    cell.id = `${colLetter}${rowNumber}`;
    cell.classList.add('cell');
  
    if (colLetter === 'G') {
      cell.style.backgroundColor ="#cfedbc";
      cell.disabled = true;
    } else if (colLetter === 'A') {
      cell.style.backgroundColor = '#5882cb8c';
      cell.oninput = () => handleAColumnInput(rowNumber);
      if(rowNumber > 2){
        cell.disabled = true;
      }
    } else if (colLetter === 'D') {
      cell.style.backgroundColor = "#ffe699";
      cell.value = lastDValue;
      cell.oninput = () => handleDColumnInput(rowNumber);
    } else if (colLetter === 'J' && rowNumber === 2) {
      cell.value = 0.1;
      cell.oninput = () => handleCustomRate(rowNumber);
      cell.style.backgroundColor = "#FFC000";
    } else if (colLetter === 'E') {
      cell.style.backgroundColor = "#fff2cc";
      cell.value = lastEValue; 
      cell.oninput = () => handleEColumnInput(rowNumber);
    } else if (colLetter === "F"){
      cell.disabled = true;
      cell.oninput = () => handleFColumnInput(rowNumber);
    }
  
    return cell;
  }
  
  function handleFColumnInput(rowNumber) {
    const currentCell = document.getElementById(`F${rowNumber}`);
  
    const value = currentCell.value;
    lastFValue = value;
  
    for (let i = rowNumber; i <= rowCount; i++) {
      const cellBelow = document.getElementById(`F${i}`);
      if (cellBelow) {
        cellBelow.value = value;
      }
    }
  
  }
  
  function handleAColumnInput(rowNumber) {
    const currentCell = document.getElementById(`A${rowNumber}`);
    const newValue = parseInt(currentCell.value);
  
    if (!isNaN(newValue)) {
      for (let r = rowNumber + 1; r <= rowCount; r++) {
        const cellBelow = document.getElementById(`A${r}`);
        if (cellBelow) {
          cellBelow.value = newValue + (r - rowNumber);
        }
      }
    }
  }
  
  

  function handleDColumnInput(rowNumber) {
    const currentCell = document.getElementById(`D${rowNumber}`);
    const value = currentCell.value;
  
    lastDValue = value; 
  
   
    for (let i = rowNumber + 1; i <= rowCount; i++) {
      const cellBelow = document.getElementById(`D${i}`);
      if (cellBelow) {
        cellBelow.value = value; 
      }
    }
  
  fetchGValues();
  }
  
  function addRow() {
    const spreadsheet = document.getElementById('spreadsheet');
    const row = document.createElement('div');
    row.classList.add('row');
  
    const rowNumber = document.createElement('div');
    rowNumber.classList.add('row-number');
    rowNumber.innerText = rowCount; 
    row.appendChild(rowNumber);
  
    const previousRowAValue = document.getElementById(`A${rowCount - 1}`)?.value;
  
    for (let i = 0; i < colCount; i++) {
      const colLetter = String.fromCharCode(65 + i); 
      if (colLetter === 'B' || colLetter === 'C') continue; 
      const cell = createCell(rowCount, colLetter);
  
      if (colLetter === 'A' && previousRowAValue) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const newValue = parseInt(previousRowAValue) + 1 || currentYear; 
        cell.value = newValue;
      }
  

      if (colLetter === 'F') {
        if (rowCount === 2) {
          cell.value = 1000; 
        } else if (rowCount >= 3 && rowCount <= 46) {
          cell.value = lastFValue; 
        }
      }
  
      row.appendChild(cell);
    }
  
    spreadsheet.appendChild(row);
   
    updateGCells(rowCount);
  fetchGValues();
   
    rowCount++;
  }


  function updateCells() {
    const rateValue = parseFloat(document.getElementById('customRate').value) || 0.1;
  
    for (let row = 2; row <= rowCount; row++) {
      let gPrevValue = document.getElementById(`G${row - 1}`)?.value.trim() || "0";
      let dValue = document.getElementById(`D${row}`)?.value.trim() || "0";
  
      gPrevValue = parseFloat(gPrevValue) || 0;
      dValue = parseFloat(dValue) || 0;
  
      const gValue = (gPrevValue + dValue) * rateValue + (gPrevValue + dValue);
  
      const gCell = document.getElementById(`G${row}`);
      if (gCell) {
        gCell.value = gValue.toFixed(2); 
      }
    }
    initializeRows();
  }

  function handleCustomRate() {
    const rateValue = parseFloat(document.getElementById('customRate').value);
  
    if (!isNaN(rateValue)) {
      for (let r = 2; r <= rowCount; r++) {
        const eCell = document.getElementById(`E${r}`);
        if (eCell) {
          eCell.value = rateValue; 
          updateGCells(r); 
        }
      }
      fetchGValues()
    }
  }
  
  function handleEColumnInput(rowNumber) {
    const currentCell = document.getElementById(`E${rowNumber}`);
    const newValue = currentCell.value;
  
    lastEValue = newValue; 
  
  
    for (let r = rowNumber + 1; r <= rowCount; r++) {
      const cellBelow = document.getElementById(`E${r}`);
      if (cellBelow) {
        cellBelow.value = newValue; 
      }
    }
  
    updateGCells(rowNumber);
    fetchGValues();
  }
  
  
  function initializeRows() {
    for (let row = 2; row < rowCount; row++) {
      const aCell = document.getElementById(`A${row}`);
      if (aCell) {
        let previousValue = document.getElementById(`A${row - 1}`).value;
        if (!isNaN(previousValue) && previousValue !== "") {
          aCell.value = parseInt(previousValue) + 1;
        }
      }
    }
  }
  
  for (let index = 0; index < 41; index++) {
    addRow();
  }
  
  function exportToCSV() {
    let data = [];
    let rows = document.querySelectorAll(".row");
  
    rows.forEach((row) => {
      let rowData = [];
      let cells = row.querySelectorAll("input.cell");
      cells.forEach((cell) => {
        rowData.push(cell.value || "");
      });
      data.push(rowData.join(",")); 
    });
  
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }
  
    let csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spreadsheet_data.csv");
    document.body.appendChild(link);
  
    link.click();
    document.body.removeChild(link);
  }
  
  initializeRows(); 
  fetchGValues(); 




function getUsers() {
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  if (!token) {
      console.log("Токен не найден в localStorage");
      return; // Прерываем выполнение, если токен не найден
  }

  // Настроим заголовки для запроса
  const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  };

  // Выполняем запрос с использованием fetch
  fetch('http://localhost:3000/users', {
      method: 'GET', // Используем метод GET для получения данных
      headers: headers // Передаем заголовки с токеном
  })
  .then(response => {
      if (!response.ok) {
          console.log('refreshing...')
          refresh();
          getUsers();

      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Обрабатываем полученные данные
  })
  .catch(error => {
      console.error('Ошибка:', error);
  });
}
