const GameState = {
  MENU: 0,
  WORKS: 1,
  PAUSED: 2
}

let needTimeToSkip = 0
const game = {
  state: GameState.MENU,
  player: {x: 0, y: 0, realX: 0, realY: 0},
  map: {width:16, height:16, cellSize: 0, color: ["#CCC", "#EBA", "#BC9", "#DC9"]},
  start() {
    this.player.x = Math.floor(this.map.width/2); this.player.y = this.map.height
    this.player.realX = (this.player.x + 0.5) * this.map.cellSize; this.player.realY = this.player.y * this.map.cellSize
    this.state = GameState.WORKS
  },
  logic(timePass) {
    let maxSpeed = this.map.cellSize * timePass / 1000
    
    let dx = this.player.realX - (this.player.x + 0.5) * this.map.cellSize
    if (Math.abs(dx) < maxSpeed) {
      this.player.realX = (this.player.x + 0.5) * this.map.cellSize
    } else {      
      this.player.realX -= Math.sign(dx) * maxSpeed
    }
    let dy = this.player.realY - (this.player.y) * this.map.cellSize
    if (Math.abs(dy) < maxSpeed) {
      this.player.realY = (this.player.y) * this.map.cellSize
    } else {      
      this.player.realY -= Math.sign(dy) * maxSpeed
    }

    if (needTimeToSkip > 0) {
      needTimeToSkip -= timePass
      return
    }
    
    //let distance = control.axis
    //multiplication(distance, maxSpeed)
    if (control.keyboard.isGoLeft) {
      this.player.x--
      needTimeToSkip = 1000
    } else if (control.keyboard.isGoRight) {
      this.player.x++
      needTimeToSkip = 1000
    }
    if (this.player.y < this.map.height) {
      this.player.y++
      needTimeToSkip = 1000
    } else if (control.keyboard.isGoUp) {
      this.player.y--
      needTimeToSkip = 1000
    }

  },

  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
    ctx.font = Math.floor(Math.min(settings.screen.width, settings.screen.height)/16/2.6)+"px Consolas"
    
    for(let j = 0; j < (settings.screen.orientation == ScreenOrientation.PORTRAIT ? this.map.height : this.map.width); j++) {
      for(let i = 0; i < (settings.screen.orientation == ScreenOrientation.PORTRAIT? this.map.width : this.map.height); i++) {
          ctx.fillStyle = this.map.color[2*(j%2)+(i%2)] // CCC - -, EA8 i -, DB8 - j, FC8 i j
          ctx.fillRect(settings.screen.offset.x + i*(this.map.cellSize*1.25), settings.screen.offset.y + j*this.map.cellSize, (this.map.cellSize*1.25), this.map.cellSize)
          ctx.fillStyle = "#000"
          let text = (j<1?"0x0":"0x")+(i+16*j).toString(16).toUpperCase()
          ctx.fillText(text, settings.screen.offset.x + (i+0.5)*(this.map.cellSize*1.25) - ctx.measureText(text).width/2, settings.screen.offset.y + (j+0.43)*this.map.cellSize)
          ctx.fillStyle = "#555"
          text = i+16*j
          ctx.fillText(text, settings.screen.offset.x + (i+0.5)*(this.map.cellSize*1.25) - ctx.measureText(text).width/2, settings.screen.offset.y + (j+0.85)*this.map.cellSize)
      }
    }

    control.drawStick(ctx, ctxWidth, ctxHeight, timePass)
    if (settings.debug) {
      diagnostic.drawFpsInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}
