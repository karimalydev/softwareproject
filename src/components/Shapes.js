import { Shape } from "./Shape.js";

let A = new Shape("A", [[0, 0], [0, 1], [0, 2],
                        [1, 0],         [1, 2]
                ]);

let B = new Shape("B", [                [0, 2], [0, 3],
                        [1, 0], [1, 1], [1, 2]
                ]);

let C = new Shape("C", [        [0, 1],
                        [1, 0], [1, 1],
                                [2, 1], [2, 2]
                ]);

let D = new Shape("D", [        [0, 1],
                        [1, 0], [1, 1], [1, 2]
                ]);

let E = new Shape("E", [        [0, 1],
                        [1, 0], [1, 1], [1, 2], [1, 3]
                ]);

let F = new Shape("F", [        [0, 1], [0, 2],
                        [1, 0], [1, 1], [1, 2],
                ]);

let G = new Shape("G", [        [0, 1], [0, 2],
                        [1, 0], [1, 1],
                ]);

let H = new Shape("H", [[0, 0], [0, 1],
                        [1, 0],
                        [2, 0],
                ]);

let I = new Shape("I", [[0, 0], [0, 1], [0, 2],
                                        [1, 2],
                                        [2, 2]
                ]);

let J = new Shape("J", [[0, 0],
                        [1, 0], [1, 1], [1, 2], [1, 3]
                ]);

let K = new Shape("K", [[0, 0],
                        [1, 0], [1, 1]
                ]);

let L = new Shape("L", [[0, 0], [0, 1],
                                [1, 1], [1, 2],
                                        [2, 2]
                ]);

export { A, B, C, D, E, F, G, H, I, J, K, L };