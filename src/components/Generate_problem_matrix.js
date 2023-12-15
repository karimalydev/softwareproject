import { Shape } from "./Shape.js";
import {A, B, C, D, E, F, G, H, I, J, K, L} from "./Shapes.js";

let shape_cols = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9,
    "K": 10,
    "L": 11
};

function coord_to_col(coord) {
    return 12 + 11 * coord[0] + coord[1];
}

function shape_to_row(shape) {
    let row = new Array(67);
    for (let i = 0; i < 67; i++) {
        row[i] = 0;
    }
    row[shape_cols[shape.name]] = 1;
    for (let i = 0; i < shape.layout.length; i++) {
        row[coord_to_col(shape.layout[i])] = 1;
    }
    return row;
}

let shapes = [A, B, C, D, E, F, G, H, I, J, K, L];

function populate_problem_matrix() {
    let problem_matrix = [];
    for (let shape of shapes) {
        //console.log(shape.name);
        let starting_pos_store = [];
        let rotation_count = 0;
        while (true) {
            let skip = false;
            for (let starting_layout of starting_pos_store) {
                if (shape.equal_layouts(starting_layout)) {
                    skip = true;
                }
            }
            if (!skip) {
                starting_pos_store.push(shape.layout);
                for (let row = 0; row < 5; row++) {
                    let place_count = 0;
                    //console.log("Row: " + row.toString());
                    if (shape.translate(row, 0)) {
                        for (let col = 0; col < 11; col++) {
                            if (col === 0) {
                                place_count += 1;
                                problem_matrix.push(shape_to_row(shape));
                            } else if (shape.translate(0, 1)) {
                                place_count += 1;
                                problem_matrix.push(shape_to_row(shape));
                                if (col === 10) {
                                    shape.reset_coord();
                                }
                            } else {
                                //console.log(place_count);
                                shape.reset_coord();
                                break;
                            }
                        }
                    }
                }
            }
            if (rotation_count < 4) {
                shape.rotate();
                rotation_count += 1;
                //console.log(shape.layout);
                //console.log("Rotation: " + rotation_count.toString());
            } else if (rotation_count === 4) {
                shape.flip();
                //console.log(shape.layout);
                rotation_count += 1;
                //console.log("Flip");
            } else if (rotation_count > 4 && rotation_count < 8) {
                shape.rotate();
                //console.log("Rotation: " + rotation_count.toString());
                rotation_count += 1;
            } else {
                //console.log("Size: " + problem_matrix.length.toString());
                break;
            }
        }
    }
    return problem_matrix;
}

function generate_headers () {
    let headers = [];
    let shape_names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    for (let i of shape_names) {
        headers.push(i);
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 11; j++) {
            headers.push(i.toString() + "," + j.toString());
        }
    }
    return headers;
}

// Function to remove columns and rows corresponding to a given starting position: shapes_used = array with shape letters, squares_used = array of array of square coords.
// problem_matrix and problem_headers are produced from assuming empty starting position
function reduce_problem_matrix (problem_matrix, problem_headers, shapes_used, squares_used) {
    let used_cols = []
    for (let shape of shapes_used) {
        used_cols.push(shape_cols[shape]);
    }
    for (let squares of squares_used) {
        for (let square of squares) {
            used_cols.push(problem_headers.indexOf(square));
        }
    }
    //console.log(used_cols);
    let used_cols_sorted = new Uint8Array(used_cols);
    used_cols_sorted = used_cols_sorted.sort();
    used_cols_sorted = used_cols_sorted.reverse();
    for (let i = problem_matrix.length - 1; i >= 0; i--) {
        for (let j of used_cols_sorted) {
            if (problem_matrix[i][j] && used_cols_sorted.includes(j)) {
                // If row has 1 in used column, remove row from matrix
                problem_matrix.splice(i, 1);
                break;
            } else if (used_cols_sorted.includes(j)) {
                // If column is used, remove column from row
                problem_matrix[i].splice(j, 1);
            }
        }
    }
    for (let i of used_cols_sorted) {
        problem_headers.splice(i, 1);
    }
    return [problem_matrix, problem_headers]
}

export { populate_problem_matrix, generate_headers, reduce_problem_matrix };