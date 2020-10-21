enum Field {
  EMPTY = 0,
  TAKEN = 1
}

class Move {
    private oldPosition : [number, number]; // old position  of the figure
    private newPosition : [number, number]; // new position of moved figure
    private removePosition : [number, number]; // position we removed a figure

    constructor(oldPosition : [number, number], newPosition : [number, number], removePosition : [number, number] ) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.removePosition = removePosition;
    }

    getOldPosition() : [number, number] {
        return this.oldPosition;
    }

    getNewPosition() : [number, number] {
        return this.newPosition;
    }

    getRemovePosition() : [number, number] {
        return this.removePosition;
    }
}

class Solitaire {
    private playground: number[][];
    
    ignore_list: number[][] = [[0, 0], [1, 0], [0, 1], [1, 1], [5, 0], [6, 0], [5, 1], [6, 1], [0, 5], [0, 6], [1, 5], [1, 6], [6, 5], [6, 6], [5, 6], [5, 5]];

    constructor() {

        this.initialize();
    }

    initialize() {
        this.playground = [];
        for (let x = 0; x < 7; x++) {
            this.playground[x] = [];        
            for (let y = 0; y < 7; y++) {
                this.playground[x][y] = Field.TAKEN;        
                
                // check for center
                if (x == 3 && y == 3) {
                    this.playground[x][y] = Field.EMPTY;        
                }

            }
        }
    }

    isOutside( x: number, y: number) {
        //out of range if we are outside the matrix
        if (x < 0 || x > 6 || y < 0 || y > 6) return true;

        //out of range if we are in corners
        for (let i = 0; i < this.ignore_list.length; i++) {
            if (this.ignore_list[i][0] == x && this.ignore_list[i][1] == y)
                return true;
        }
        return false;
    }

    move (move : Move) {
        let oldPos = move.getOldPosition();
        let newPos = move.getNewPosition()
        let remPos = move.getRemovePosition();

        this.playground[oldPos[0]][oldPos[1]] = 0;
        this.playground[remPos[0]][remPos[1]] = 0;
        this.playground[newPos[0]][newPos[1]] = 1;
    }

    async run() {
        // let tokensLeft = 0;
        // let runCount = 0;
            
        console.log("start"); 
        // do { // this loop is only for multiple games
            this.initialize();
            let moves = this.getPossibleMoves();
            // runCount++;
            // tokensLeft = 0;
            while (moves.length > 0) {
                //pick a random next move
                let ran = Math.floor(Math.random() * moves.length);
                let move = moves[ran];
                
                //actuall move 
                this.move(move);
                this.render(move);
                //lets see how the computer is playing...add a sleep)
                await new Promise(resolve => setTimeout(resolve, 1000));        
                
                //loop to next step
                moves = this.getPossibleMoves();
            }
            
                
            // check for left tokens
            // for (let x = 0; x < 7; x++) {
            //     for (let y = 0; y < 7; y++) {
            //         if (this.isOutside(x,y)) continue;
            //         if (this.playground[x][y] == Field.TAKEN) tokensLeft++;
            //     }
            // }
            // if (runCount % 10000 == 0)
            //     console.log("games played: " + runCount);
            
        // } while (tokensLeft > 1);  
        // this.render();
        
    }

    render(selectedMove : Move) {
        let output : String = "";
        let oldPos = selectedMove.getOldPosition();
        let newPos = selectedMove.getNewPosition()
        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 7; y++) {
                if (this.isOutside(x,y)) output += 'x ';
                else if (this.playground[x][y] == Field.EMPTY) {
                    if (x == oldPos[0] && y == oldPos[1]) output += '<b>0</b> ';
                    else output += '0 ';
                }
                else if (this.playground[x][y] == Field.TAKEN) {
                    if (x == newPos[0] && y == newPos[1]) output += '<b>1</b> ';
                    else output += '1 ';
                }
            }
            output += '<br>';
        }

        document.body.innerHTML = output.toString();
    }

    getPossibleMoves() : Move[] {
        let moves : Move[];
        moves = [];

        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 7; y++) {
                if (this.isOutside(x, y)) continue;

                if (this.playground[x][y] == Field.TAKEN) {
                    if (!this.isOutside(x+1, y) &&  !this.isOutside(x+2, y) && this.playground[x+1][y] == Field.TAKEN && this.playground[x+2][y] == Field.EMPTY) moves.push(new Move([x, y], [x+2, y], [x+1, y]));
                    if (!this.isOutside(x-1, y) &&  !this.isOutside(x-2, y) && this.playground[x-1][y] == Field.TAKEN && this.playground[x-2][y] == Field.EMPTY) moves.push(new Move([x, y], [x-2, y], [x-1, y]));
                    if (!this.isOutside(x, y+1) &&  !this.isOutside(x, y+2) && this.playground[x][y+1] == Field.TAKEN && this.playground[x][y+2] == Field.EMPTY) moves.push(new Move([x, y], [x, y+2], [x, y+1]));
                    if (!this.isOutside(x, y-1) &&  !this.isOutside(x, y-2) && this.playground[x][y-1] == Field.TAKEN && this.playground[x][y-2] == Field.EMPTY) moves.push(new Move([x, y], [x, y-2], [x, y-1]));
                }
            }
        }
        return moves;
    }

    
    getField() {
        return this.playground;
    }
}

let solitaire = new Solitaire();

solitaire.run();


