document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    //The tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],             //01, 11, 21, 02
        [width, width+1, width+2, width*2+2],   //10, 11, 12, 22
        [1, width+1, width*2+1, width*2],       //01, 11, 21, 20
        [width, width*2, width*2+1, width*2+2]  //10, 20, 21, 22
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

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4 // controls a column in which tetrominoes comes into
    let currentRotation = 3 // controls the direction that a tetromino is pointing to: up, down, right, left

    // randomly choose tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation] // 4 rotated versions of the same tetomino

    // squares: 10 ⨉ 20 grid

    // what draw does: using [1, width + 1, width * 2 + 1, 2] for example
    // squares[currentPosition + 1].classList.add('tetromino')
    // squares[currentPosition + width + 1].classList.add('tetromino')
    // squares[currentPosition + width * 2 + 1].classList.add('tetromino')
    // squares[currentPosition + 2].classList.add('tetromino')

    function draw() {
        current.forEach(index => squares[currentPosition + index].classList.add('tetromino')) // index: each one of [1, width+1, width*2+1, 2]
    }

    function undraw() {
        current.forEach(index => squares[currentPosition + index].classList.remove('tetromino'))
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    
    function control(e) {
        if(e.keyCode == 32) {
            startGame()
        }
        else if(e.keyCode == 37) {
            moveLeft()
        }
        else if(e.keyCode == 38) {
            rotate()
        }
        else if(e.keyCode == 39) {
            moveRight()
        }
        else if(e.keyCode == 40) {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) {
            currentPosition -= 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) {
            currentPosition += 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        
        draw()
    }

    function rotate() {
        undraw()
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayShape() {
        displaySquares.forEach(square => square.classList.remove('tetromino'))
        upNextTetromino[nextRandom].forEach(index => displaySquares[displayIndex + index].classList.add('tetromino'))
    }

    var speed = 1000;
    
    function startGame() {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, speed)
            displayShape()
        }
    }

    function addScore() {
        for(let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = ' Game is over!'
            clearInterval(timerId)
        }
    }

    var data = 1;
  
    document.getElementById("level").innerText = data;
    
    const increment = document.querySelector('#increment')
    const decrement = document.querySelector('#decrement')


    increment.addEventListener('click', () => {
        if(data != 5) {
            data = data + 1;
        } 
        if(speed >= 400) {
            speed -= 200
        }
        document.getElementById("level").innerText = data;
    })

    decrement.addEventListener('click', () => {
        if(data != 1) {
            data = data - 1;
        }
        if(speed <= 800) {
            speed += 200
        }
        document.getElementById("level").innerText = data;
    })

})


