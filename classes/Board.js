export default class Board {

    constructor() {
        /*this.matrix = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];*/
        this.matrix = [...new Array(3)].map(row =>
            [...new Array(3)].map(column => ' ')
        );
    }

    // render = output/draw something
    render() {
        // console.table(this.matrix);
        let line = '\n' + '-'.repeat(13) + '\n';
        console.log(
            line +
            this.matrix.map(row =>
                row.map(column => `| ${column} `).join('')
                + '|').join(line) +
            line
        );
    }
}