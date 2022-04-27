document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
const width = 10
let nextRandom = 0 // we brought this up becausewe want to use it in our freeze function, remember it's good practive for variable to start at top of script
let timerId // this is null
let score = 0
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
]


// console.log(squares)
 const lTetromino = [
     [1, width+1, width*2+1, 2],
     [width, width+1, width+2, width*2+2],
     [1, width+1, width*2+1, width*2],
     [width, width*2, width*2+1, width*2+2]
 ]

 const zTetromino = [
     [0, width, width+1, width*2+1],
     [width+1, width+2, width*2, width*2+1],
     [0, width, width+1, width*2+1],
     [width+1, width+2, width*2, width*2+1]
 ]

 const tTetromino = [
     [1, width, width+1, width+2],
     [1, width+1, width+2, width*2+1],
     [width, width+1, width+2, width*2+1],
     [1, width, width+1, width*2+1]
 ]

 const oTetromino = [
     [0, 1, width, width+1],
     [0, 1, width, width+1],
     [0, 1, width, width+1],
     [0, 1, width, width+1]
 ]

 const iTetromino = [
     [1, width+1, width*2+1, width*3+1],
     [width, width+1, width+2, width+3],
     [1, width+1, width*2+1, width*3+1],
     [width, width+1, width+2, width+3]
 ]

// Put the arrays of shapes into another single array
const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
// let current = theTetrominoes[0][0]
let currentRotation = 0 // means it will always be the first element of every array

// randomly  select a Tetromino and its first rotation
let random = Math.floor(Math.random()*theTetrominoes.length) // random integer from 0 to 4
let current = theTetrominoes[random] [currentRotation]
//          [1st arr, Parent Array] [2nd arr, child Array]

console.log(random)

// draw the first rotation in the first Tetromino

// draw the Tetromino
function draw() {
    current.forEach(index => { // for each of the divs that have the index "nos" that correlates to the integers in the array
        squares[currentPosition + index].classList.add('tetromino') //index is a 2 arrays, 4 is added to each item of array,then the class
        squares[currentPosition + index].style.backgroundColor = colors[random]
        // console.log(index)
    })
}

//  undraw the Tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

// make a Tetromino move down every second
// timerId = setInterval(moveDown, 100)  now we are going to call this function at the click of a button

// assign functions to keyCodes
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}


// the move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    // moveLeft() this helped me to move closer to the bug
    freeze()

}

// freeze function
function freeze() { // what does index really stand for?
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) { // going into the future to check
        current.forEach(index => squares[currentPosition + index].classList.add('taken')) // csn only be added to array not the div
        //  why does the  Tetromino freeze when a class of taken is added to it?------------------------------------------
       // because the function that goes into the future with the "width (lense)",sees that the tetris has a class of taken
        // remember that we added taken if the future width has a taken class

        // start a new tetromino falling again
        random = nextRando
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random] [currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()


    }
}

// the index is just arrays for all tetrominoes shapes nothing more or less,

//  move the Tetromino left, unless iit is at the edge  or there is a blockage
function moveLeft() {
    undraw()
    // check for left wall collisions
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

if(!isAtLeftEdge) currentPosition -=1 // make Tetromino go left

    // check if there's is a tetrimino below, dont really get this though
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1 // give yourself time you will understand all
        //  here we are simply reversing the move to the left if the class contains "taken" chikena
    }

    draw()
}

function moveRight() {
    undraw()
    // check for right wall collisions
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition +=1 // make Tetromino go  right

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }

    draw()
}

// rotate the tetromino
function rotate() {
    undraw()
    currentRotation ++ // i dont want this to make some Tetrominoes get added to the next row when i rotate them

    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
    }
    current = theTetrominoes [random] [currentRotation]
    draw() // and then we draw it
}

// show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

// the mini-grid display Tetromino
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],  //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], // oTetromino   SQUARE  TETROMINO
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino

]
// console.log(upNextTetrominoes)

// display the shape in the mini-grid display
function displayShape()  {
    // remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino') // we are constantly removing and add a new one, thats why we remove first
        square.style.backgroundColor = ''
    })

    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}



// add functionality to the start/pause button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        document.addEventListener('keyup', control)
        draw()
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
    }
})

//  add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squareRemoved = squares.splice(i, width)
            // add the squaresRemovedd back to the grid[squares] so that it does not become smaller than 199
            squares = squareRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            console.log(squareRemoved)
        }
    }
}

// game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            document.removeEventListener('keyup', control);
        }
    }
