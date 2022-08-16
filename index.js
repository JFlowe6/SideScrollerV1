const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5

class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 50
        this.height = 50
    }

    draw(){
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }
}

class Platform {
    constructor({x, y}) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 200
        this.height = 30
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Hole {
    constructor({x, y}){
        this.position = {
            x: x,
            y: y
        }
        this.width = 300
        this.height = 5
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


const player = new Player()
const platforms = [new Platform({x: 200, y: 300}), 
                   new Platform({x: 500, y: 500})]

const holes = [new Hole({x: 250, y: 629})]                   
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}

// this is to limit the player to a double jump
let keyHeld = false
let onPlatform = false
let onHole = false
let jumpCount = 0

// this will be used to get a win scenario, need to just add a condition to be met to win
let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
       platform.draw()
    })
    holes.forEach(hole => {
        hole.draw()
    })

    if (keys.up.pressed && !keyHeld && jumpCount < 2) {
        player.velocity.y = -15
        keyHeld = true
        jumpCount++
    } else if(jumpCount==2 && player.position.y==584.5 
        || jumpCount==2 && onPlatform){
        jumpCount = 0
    }

    if (keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed){   
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
            holes.forEach(hole => {
                hole.position.x -= 5
            })
        }

        if (keys.left.pressed){
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
            holes.forEach(hole => {
                hole.position.x += 5
            })
        }
    }

// Rectangular collision detection
platforms.forEach(platform => {
       
    if (player.position.y + player.height <= platform.position.y 
        && player.position.y + player.height + player.velocity.y >= platform.position.y
        && player.position.x + player.width >= platform.position.x
        && player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
        onPlatform = true
        jumpCount = 0
    } else {
        onPlatform = false
    }

})

holes.forEach(hole => {

    if (player.position.y + player.height >= hole.position.y 
        && player.position.y + player.height + player.velocity.y >= hole.position.y
        && player.position.x + player.width >= hole.position.x
        && player.position.x <= hole.position.x + hole.width){
        player.velocity.y = 0
        onHole = true
    } else {
        onHole = false
    }
})

}
animate()

addEventListener('keydown', ( {keyCode} ) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log('left')
            keys.left.pressed = true
            break
        
        case 83: 
            console.log('down')
            break
        
        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        
        case 87:
            console.log('up')
            keys.up.pressed = true
            break
    }
})

addEventListener('keyup', ( {keyCode} ) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log('left')
            keys.left.pressed = false
            break
        
        case 83: 
            console.log('down')
            break
        
        case 68:
            console.log('right')
            keys.right.pressed = false
            break
        
        case 87:
            console.log('up')
            keys.up.pressed = false
            keyHeld = false
            break
    }
})