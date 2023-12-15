import { compile } from "vue";

const STEP = Math.sqrt(2);

// the top's id is 1;
function calcPosition(layer, radius, x, y, maxLayer) {
    let z = (maxLayer - layer) * STEP + radius; 
    let xx = radius + 2 * x * radius + radius * (maxLayer - layer);
    let yy = radius + 2 * y * radius + radius * (maxLayer - layer);

    return [xx, yy, z];
}


class PyramidLayer {
    size;
    matrix;
    constructor(size, radius, total) {
        let matrix = [];
        this.size = size;

        matrix = []
        for (let i = 0; i < size; i++) {
            matrix.push([]);
            for (let j = 0; j < size; j++) {
                matrix[i].push({
                    color: 0xFFD700,
                    pos: calcPosition(size, radius, i, j, total),
                    userData: null
                });
            }
        }

        this.matrix = matrix;
    }

    
    fill(matrix) {
        for (let i = 0; i < this.size; i++) 
            for (let j = 0; j < this.size; j++) 
                this.matrix[i][j].color = matrix[i][j];
    }

    set(x, y, color) {
        this.matrix[x][y].color = color;
    }

    get(x, y) {
        return this.matrix[x][y];
    }

    /*getColor(x, y) {
        return this.matrix[x][y].color;
    }*/
}

class Pyramid {
    n;
    layers;
    r;

    constructor(layersNum, sphereRadius = 1) {
        this.n = layersNum;
        this.r = sphereRadius;
        this.init();
    }

    radius() {
        return this.r;
    }

    getLayer(layer) {
        return this.layers[this.n - layer];
    }

    get(layer, x, y) {
        return this.layers[layer].get(x, y);
    }

    init() {
        // 计算
        this.layers = [];
        for (let i = 0; i < this.n; i++) {
            this.layers.push(new PyramidLayer(this.n - i, this.r, this.n));
        }
    }
}

export default Pyramid;
export { PyramidLayer }
