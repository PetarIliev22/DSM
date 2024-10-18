// Генерира полета за въвеждане на матрица на съседство
function generateMatrix() {
    const size = +document.getElementById('matrixSize').value; 
    const container = document.getElementById('matrixContainer'); 
    container.innerHTML = ''; 
    
    if (size < 2 || size > 8) return alert('Размерът на матрицата трябва да е между 2 и 8.');
    if (size >= 4 && window.innerWidth < 560) alert('Моля, завъртете телефона хоризонтално.');

    let messageShown = false; 
    let tableHTML = '<table><tr><th></th>' + Array.from({ length: size }, (_, i) => `<th>V${i + 1}</th>`).join('') + '</tr>'; //Колони
    for (let i = 0; i < size; i++) 
        {tableHTML += `<tr><th> V${i+ 1}</th>` + Array.from({ length: size }, (_, j) =>`<td><input type="number" min="0" max="1" value="0" id="cell-${i}-${j}" /></td>`).join('') + '</tr>';} //Редове

    tableHTML += '</table>'; 
    container.innerHTML = tableHTML; 

    //Обработчик на събития за всяко входно поле, докато го създаваме
    for (let i = 0; i < size; i++) 
        { 
        for (let j = 0; j < size; j++) {
            const input = document.getElementById(`cell-${i}-${j}`); 
            input.addEventListener('click', () => 
                { 
                if (!messageShown) 
                    { alert('Моля, въведете само 0 или 1'); 
                        messageShown = true;}
                }
            );
        }
    }
    document.getElementById('sortButton').style.display = 'inline-block';
}


// Извлича матрицата от въведените стойности
function getMatrix(size) {
    return Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => +document.getElementById(`cell-${i}-${j}`).value));
}

// Топологично сортиране
function topologicalSort() {
    const size = +document.getElementById('matrixSize').value;
    const matrix = getMatrix(size);
    let inDegree = Array(size).fill(0);
    matrix.forEach(row => row.forEach((val, j) => { 
            if (val) inDegree[j]++; 
        })
    );
    const levels = [];
    const output = document.getElementById('outputContainer');
    
    while (true) {
        //Намиране на текущите върхове без входящи ръбове
        const current = inDegree.map((deg, i) => deg === 0 ? i : -1).filter(i => i !== -1);
        if (!current.length) break;
        levels.push(current);
        current.forEach(i => {
            inDegree[i] = -1;
            matrix[i].forEach((val, j) => { if (val) inDegree[j]-- });
        });
    }
    
// Извеждане на резултат
    if (levels.flat().length === size) {
        output.innerHTML = '<h2>Резултат:</h2>'; 
        levels.forEach((lvl, idx) => {output.innerHTML += `<p><strong>"V${idx + 1}"</strong>: <i>${lvl.map(i => `Премахване на ред и колона V${i + 1}`).join(', ')}, защото има само нули.</i></p>`;});
    } else {
        output.innerHTML = 'Графът съдържа цикъл и не може да бъде сортиран топологично.';
    }

// Визуализация на графа
     visualizeGraph(matrix);
    }
// Визуализира графа
function visualizeGraph(matrix){
    document.getElementById('graphContainer').style.display = 'block';
    
    const nodes = []; // Массив за върховете
    const edges = []; // Массив за връзки

    // Създаване на върховете
    for (let i = 0; i < matrix.length; i++) {
        nodes.push({ id: i, label: `V ${i+1}`, shape: 'dot', color: { background: '#1E90FF', border: '	#006400',} });
    }
    // Създаване на връзки между върховете
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                edges.push({from: i, to: j, arrows: { to: { enabled: true, scaleFactor: 1, type: 'arrow' } } 
                });
            }
        }
    }
    
    // Създаване на мрежата
    const container = document.getElementById('graphContainer');
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = { physics: false };
    new vis.Network(container, data, options);
}

