document.getElementById('csvFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csvContent = e.target.result;
        parseCSV(csvContent);
      };
      reader.readAsText(file);
    } else {
      document.getElementById('output').innerHTML = '<p>No file selected. Please upload a CSV file.</p>';
    }
  });
  
  function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    const headers = rows.shift().split(',');
    const data = rows.map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
        return obj;
      }, {});
    });
    analyzeData(headers, data);
  }
  
  function analyzeData(headers, data) {
    const rowCount = data.length;
    const uniqueValues = headers.map(header => {
      const values = new Set(data.map(row => row[header]));
      return { column: header, uniqueCount: values.size };
    });
    const numericColumns = headers.filter(header => data.every(row => !isNaN(parseFloat(row[header]))));
    const numericSums = numericColumns.map(header => ({
      column: header,
      total: data.reduce((sum, row) => sum + parseFloat(row[header] || 0), 0)
    }));
    displayResults(headers, data, rowCount, uniqueValues, numericSums);
  }
  
  function displayResults(headers, data, rowCount, uniqueValues, numericSums) {
    let outputHTML = `<div class="summary">`;
    outputHTML += `<div class="summary-item"><h3>Total Rows</h3><p>${rowCount}</p></div>`;
    uniqueValues.forEach(item => {
      outputHTML += `<div class="summary-item"><h3>${item.column}</h3><p>${item.uniqueCount} unique values</p></div>`;
    });
    numericSums.forEach(item => {
      outputHTML += `<div class="summary-item"><h3>${item.column} Total</h3><p>${item.total}</p></div>`;
    });
    outputHTML += `</div>`;
  
    outputHTML += '<div class="table-container"><table><thead><tr>';
    headers.forEach(header => outputHTML += `<th>${header}</th>`);
    outputHTML += '</tr></thead><tbody>';
    data.slice(0, 5).forEach(row => {
      outputHTML += '<tr>';
      headers.forEach(header => outputHTML += `<td>${row[header]}</td>`);
      outputHTML += '</tr>';
    });
    outputHTML += '</tbody></table></div>';
  
    document.getElementById('output').innerHTML = outputHTML;
  }
  