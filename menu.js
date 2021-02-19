const ScreenOrientation = { // iOS Safari doesn't support original enum
  PORTRAIT: 1,
  LANDSCAPE: 2,
  UNKNOWN: 0
}

const settings = {
  screen: {width: 0, height: 0, orientation: ScreenOrientation.UNKNOWN, offset: {x: 0, y: 0}},
  keys: {left: 'a', right: 'd', up: 'w', down: 's'},
  debug: false
}

const menu = {
  // timeSkiped: 0,
  logic(timePass) {
    let dy = document.fullscreenElement == null ? 4 : 0 // without this bottom 4px page will get a lot of glitch 
    settings.screen.width = document.documentElement.clientWidth
    settings.screen.height = document.documentElement.clientHeight - dy

    // this.timeSkiped += timePass
    // if (this.timeSkiped > 1000) { this.timeSkiped -= 1000 }
    // else { return }

    let ls = settings.screen.width > settings.screen.height
    settings.screen.orientation = ls ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT
    if (!ls) {
      let tx = Math.floor(settings.screen.width/game.map.width), ty = Math.floor((settings.screen.height-4)/game.map.height)
      game.map.cellSize = Math.min(tx, ty)
      settings.screen.offset.x = Math.floor((settings.screen.width - game.map.cellSize*game.map.width)/2)
      settings.screen.offset.y = dy + Math.floor((settings.screen.height - dy - game.map.cellSize*game.map.height)/2) // for symmetry cut off top 4px
    } else {
      let tx = Math.floor(settings.screen.width/game.map.height), ty = Math.floor((settings.screen.height-4)/game.map.width)
      game.map.cellSize = Math.min(tx, ty)
      settings.screen.offset.x = Math.floor((settings.screen.width - game.map.cellSize*game.map.height)/2)
      settings.screen.offset.y = dy + Math.floor((settings.screen.height - dy - game.map.cellSize*game.map.width)/2)
    }
  },
  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctxWidth = canvas.width = settings.screen.width
    ctxHeight = canvas.height = settings.screen.height

    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
    ctx.font = "12px Lucida Console"
    
    for(let j = 0; j < (settings.screen.orientation == ScreenOrientation.PORTRAIT ? game.map.height : game.map.width); j++) {
      for(let i = 0; i < (settings.screen.orientation == ScreenOrientation.PORTRAIT? game.map.width : game.map.height); i++) {
        ctx.fillStyle = (i+j)%2?"#656565":"#707070"
        ctx.fillRect(settings.screen.offset.x + i*game.map.cellSize, settings.screen.offset.y + j*game.map.cellSize, game.map.cellSize, game.map.cellSize)
      }
    }
    ctx.fillStyle = "#000000A0"
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)

    ctx.font = "72px Lucida Console"
    let text = "START"
    ctx.fillStyle = "#F08030"
    let bx = ctx.measureText(text).width * 1.2, by = 72 * 1.2
    ctx.fillRect((ctxWidth - bx)/2, (ctxHeight - by)/2, bx, by)
    ctx.fillStyle = "#000"
    ctx.fillText(text, (ctxWidth - ctx.measureText(text).width)/2, (ctxHeight + 50)/2)

    if (settings.debug) {
      diagnostic.drawScreenInfo(ctx, ctxWidth, ctxHeight, timePass)
      diagnostic.drawFingerInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

const pause = {
  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.fillStyle = "#00000090" // 00 -> 90
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)
  }
}