document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    const color = [
        'red',
        'orange',
        'blue',
        'green',
        'violet'
    ]

    //Define Tetrominoes
    const lTetrominoe = [
        [1, width+1, 2*width+1, 2],
        [width, width+1, width+2, 2*width+2],
        [1, width+1, 2*width+1, 2*width],
        [width, 2*width, 2*width+1, 2*width+2]
    ]
    const zTetrominoe = [
        [width+1, width+2, 2*width, 2*width+1],
        [0, width, width+1, 2*width+1],
        [width+1, width+2, 2*width, 2*width+1],
        [0, width, width+1, 2*width+1]
    ]
    const tTetrominoe = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, 2*width+1],
        [width, width+1, width+2, 2*width+1],
        [1, width, width+1, 2*width+1],
    ]
    const squareTetrominoe =[
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const longTetrominoe = [
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3],
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetrominoe, zTetrominoe, tTetrominoe, squareTetrominoe, longTetrominoe]


    let currentPosition = 4
    let currentRotation = 0

    //randomly select a tetrominoe in its first position
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //draw the first rotation of the tetrominoe
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrominoe')
            squares[currentPosition + index].style.backgroundColor = color[random]
        })
    }

    //draw()

    //undraw the last tetrominoe
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrominoe')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }
    
    //make tetrominoe move down every second
    //timerId = setInterval(moveDown, 1000)

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        }
        else if(e.keyCode === 39) {
            moveRight()
        }
        else if(e.keyCode === 38) {
            rotate()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function for when tetrominoe gets to the bottom
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
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


    //move tetrominoe left, unless it is at the edge or there is a blockage
    function moveLeft() {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        undraw()

        if(!isAtLeftEdge){
            currentPosition -= 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }

    //move tetrominoe right, unless it is at the edge or on another block
    function moveRight(){
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        undraw()

        if(!isAtRightEdge){
            currentPosition += 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    //rotate the tetrominoe 
    function rotate() {
        undraw()
        currentRotation++
        
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //show up-next tetrominoe in the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //theTetrominoes without rotations
    const upNextTetraminoes = [
        [1, displayWidth+1, 2*displayWidth+1, 2],
        [displayWidth+1, displayWidth+2, 2*displayWidth, 2*displayWidth+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, 2*displayWidth+1, 3*displayWidth+1]
    ]

    //display upcomming tetrominoe
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetrominoe')
            square.style.backgroundColor = ''
        })
        upNextTetraminoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetrominoe')
            displaySquares[displayIndex + index].style.backgroundColor = color[nextRandom]
        })
    }

    //add functionality of the button
    startBtn.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 200; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                console.log('here')
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrominoe')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                squares[index].style.backgroundColor = ''
            }
        }
    }

    //game over
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
    
})