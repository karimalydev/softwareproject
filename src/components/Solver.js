let items = {
    'A': [1, 4, 7],
    'B': [1, 4],
    'C': [4, 5, 7],
    'D': [3, 5, 6],
    'E': [2, 3, 6, 7],
    'F': [2, 7],
    'G': [2, 3, 5, 6]
};

let sets = {
    1: new Set(['A', 'B']),
    2: new Set(['E', 'F', 'G']),
    3: new Set(['D', 'E', 'G']),
    4: new Set(['A', 'B', 'C']),
    5: new Set(['C', 'D', 'G']),
    6: new Set(['D', 'E', 'G']),
    7: new Set(['A', 'C', 'E', 'F'])
};

// X is an object which has columns as keys, each key has as value which is the set of rows corresponding to the 1s in the column
// Y is an object which has rows as keys, each key has a value which is a set columns which are 1 in that row
// Code adapted from Ali Assaf liscensed under GNU General Public License: https://www.cs.mcgill.ca/~aassaf9/python/sudoku.txt 
function* solve(X, Y, solution=[], isFourLevel=false, headers=null) { 
    if (Object.keys(X).length === 0) {
        console.log("solution!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // No columns left in X, hence valid solution
        yield Array.from(solution);
    } else {
        // console.log("test");
        let min_count = Infinity;
        let min_col;
        // Choose column with least 1s
        for (let [key, value] of Object.entries(X)) {
            if (value.size < min_count) {
                min_count = value.size;
                min_col = key;
            }
        }
        // console.log(Object.entries(X));
        for (let row of Array.from(X[min_col])) {
            solution.push(row);
            let cols = select(X, Y, row);
            for (let s of solve(X, Y, solution, isFourLevel, headers)) {
                yield s;
            }
            deselect(X, Y, row, cols);
            solution.pop()
        }
    }
    
}

function select(X, Y, r) {
    let cols = [];
    for (let j of Y[r]) {
        for (let i of Array.from(X[j])) {
            for (let k of Y[i]) {
                if (k !== j) {
                    X[k].delete(i);
                }
            }
        }
        cols.push(X[j]);
        delete X[j];
    }
    return cols;
}

function deselect(X, Y, r, cols) {
    for (let j of Y[r].slice().reverse()) {
        X[j] = cols.pop();
        for (let i of Array.from(X[j])) {
            for (let k of Y[i]) {
                if (k !== j) {
                    X[k].add(i);
                }
            }
        }
    }
}

export { items, sets, solve, select, deselect};