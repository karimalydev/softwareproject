export class Shape3D {
    constructor(name, layout) {
        this.name = name;
        this.layout = layout;
    }

    equal_layouts(other_shape_layout) {
        if (this.layout.length !== other_shape_layout.length) {
            return false;
        } else {
            let other_layout = JSON.stringify(other_shape_layout);
            for (let i = 0; i < this.layout.length; i++) {
                let element = JSON.stringify(this.layout[i]);
                if (other_layout.indexOf(element) !== -1) {
                    continue;
                } else {
                    return false
                }
            }
            return true
        }
    }

    rotate() {
        let row_change = 0;
        let col_change = 0;
        for (let i = 0; i < this.layout.length; i++) {
            let new_row = this.layout[i][1];
            let new_col = -this.layout[i][0];
            this.layout[i] = [new_row, new_col, this.layout[i][2]]
            if (new_row < 0 && new_row < row_change) {
                row_change = new_row;
            }
            if (new_col < 0 && new_col < col_change) {
                col_change = new_col;
            }
        }
        if (row_change !== 0) {
            for (let i = 0; i < this.layout.length; i++) {
                this.layout[i][0] -= row_change;
            }
        }
        if (col_change !== 0) {
            for (let i = 0; i < this.layout.length; i++) {
                this.layout[i][1] -= col_change;
            }
        }
    }

    flip() {
        let row_max = 0;
        for (let i = 0; i < this.layout.length; i++) {
            if (this.layout[i][0] > row_max) {
                row_max = this.layout[i][0];
            }
        }
        for (let i = 0; i < this.layout.length; i++) {
            this.layout[i][0] = row_max - this.layout[i][0]
        }
    }

    translate(rows, cols, grid_size) {
        let new_layout = [];
        for (let i = 0; i < this.layout.length; i++) {
            let new_row = this.layout[i][0] + rows;
            let new_col = this.layout[i][1] + cols;
            if (new_row < 0 || new_row > grid_size - 1 || new_col < 0 || new_col > grid_size - 1) {
                return false;
            } else {
                new_layout.push([new_row, new_col, this.layout[i][2]]);
            }
        }
        this.layout = new_layout;
        return true;
    }

    reset_coord() {
        let row_min = 12;
        let col_min = 12;
        for (let i = 0; i < this.layout.length; i++) {
            if (this.layout[i][0] < row_min) {
                row_min = this.layout[i][0];
            }
            if (this.layout[i][1] < col_min) {
                col_min = this.layout[i][1];
            }
        }
        for (let i = 0; i < this.layout.length; i++) {
            this.layout[i][0] -= row_min;
            this.layout[i][1] -= col_min;
        }
    }
}