import { generate_headers } from "./Generate_problem_matrix";

// Takes in solution array with elements corresponding to selected rows of the problem_matrix
function convert_to_5x11(solution, problem_matrix, mat_header, start_shapes, start_squares) {
    let num_unused_shapes = 12 - start_shapes.length;
    let out_mat = new Array(5);
    for (let i = 0; i < 5; i++) {
        out_mat[i] = new Array(11);
        out_mat[i].fill(0);
    }
    let full_header = generate_headers();
    for (let i = 0; i < start_shapes.length; i++) {
        let shape = start_shapes[i];
        for (let j = 0; j < start_squares[i].length; j++) {
            let coord = start_squares[i][j].split(",");
            out_mat[parseInt(coord[0])][parseInt(coord[1])] = shape;
        }
    }
    for (let i = 0; i < solution.length; i++) {
        let selected_row = problem_matrix[solution[i]];
        let shape = "";
        for (let j = 0; j < problem_matrix[0].length; j++) {
            if (selected_row[j] === 0) {
                continue;
            } else if(j < num_unused_shapes) {
                shape = mat_header[j];
            } else {
                let coord = mat_header[j].split(",");
                out_mat[parseInt(coord[0])][parseInt(coord[1])] = shape;
            }
        }
    }
    return out_mat;
}

export { convert_to_5x11 };