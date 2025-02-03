echo "# UntapedGames" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Untaped/UntapedGames.git
git push -u origin main
class Game2048 {
    constructor() {
        this.board = this.initGame();
    }

    initGame() {
        let board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.addNewTile(board);
        this.addNewTile(board);
        return board;
    }

    addNewTile(board) {
        let emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) emptyCells.push([r, c]);
            }
        }
        if (emptyCells.length) {
            let [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    compress(board) {
        return board.map(row => {
            let newRow = row.filter(num => num !== 0);
            while (newRow.length < 4) newRow.push(0);
            return newRow;
        });
    }

    merge(board) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === board[r][c + 1] && board[r][c] !== 0) {
                    board[r][c] *= 2;
                    board[r][c + 1] = 0;
                }
            }
        }
        return board;
    }

    reverse(board) {
        return board.map(row => row.reverse());
    }

    transpose(board) {
        return board[0].map((_, c) => board.map(row => row[c]));
    }

    moveLeft(board) {
        board = this.compress(board);
        board = this.merge(board);
        board = this.compress(board);
        return board;
    }

    moveRight(board) {
        board = this.reverse(board);
        board = this.moveLeft(board);
        board = this.reverse(board);
        return board;
    }

    moveUp(board) {
        board = this.transpose(board);
        board = this.moveLeft(board);
        board = this.transpose(board);
        return board;
    }

    moveDown(board) {
        board = this.transpose(board);
        board = this.moveRight(board);
        board = this.transpose(board);
        return board;
    }

    isGameOver(board) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) return false;
                if (c < 3 && board[r][c] === board[r][c + 1]) return false;
                if (r < 3 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }
}

const game = new Game2048();
console.log(game.board);