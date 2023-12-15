import { generate_headers } from "./Generate_problem_matrix";


function create_dicts(problem_matrix_reduced, headers_reduced, isFourLevel) {
    let X = {};
    let Y = {};
    for (let i = 0; i < problem_matrix_reduced.length; i++) {
        Y[i] = [];
        for (let j = 0; j < problem_matrix_reduced[0].length; j++) {
            if (i === 0) {
                let elem = problem_matrix_reduced[i][j];
                if (elem) {
                    X[headers_reduced[j]] = new Set([i]);
                    Y[i].push(headers_reduced[j]);
                } else {
                    X[headers_reduced[j]] = new Set([]);
                }
            } else {
                let elem = problem_matrix_reduced[i][j];
                if (elem) {
                    X[headers_reduced[j]].add(i);
                    Y[i].push(headers_reduced[j]);
                    if (X[headers_reduced[j]].size === 6) {
                        continue;
                    }
                }
            }
        }
    }
    return [X, Y];
}

export { create_dicts };