const control = {
  touch0: {x: 0, y: 0, hold: null}, stickAreaRadius: 100, stickSizeRadius: 30,
  mouse: {x: 0, y: 0, hold: null},
  keyboard: {isGoLeft: false, isGoRight: false, isGoUp: false, isGoDown: false},
  
  get axis() {
    let res = { x: this.keyboard.isGoRight - this.keyboard.isGoLeft, y: this.keyboard.isGoDown - this.keyboard.isGoUp }
    if (this.mouse.hold != null) {
      res.x += this.mouse.x - this.mouse.hold.x
      res.y += this.mouse.y - this.mouse.hold.y
    } else if(this.touch0.hold != null) {
      res.x += this.touch0.x - this.touch0.hold.x
      res.y += this.touch0.y - this.touch0.hold.y
    }
    
    if (Math.sqrt(res.x * res.x + res.y * res.y) < (this.stickAreaRadius - this.stickSizeRadius)) {
      multiplication(res, 1/(this.stickAreaRadius - this.stickSizeRadius))
    } else {
      normalize(res, 1) 
    }
    return res
  },
  drawStick(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.strokeStyle = "#00000050"
    if (control.mouse.hold != null) {
      ctx.fillStyle = "#00000030"
      ctx.beginPath();ctx.arc(control.mouse.hold.x, control.mouse.hold.y, control.stickAreaRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
      ctx.beginPath();ctx.arc(control.mouse.hold.x, control.mouse.hold.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = "#333333"
      ctx.beginPath();ctx.arc(control.mouse.x, control.mouse.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
    }
    if (control.touch0.hold != null) {
      ctx.strokeStyle = "#00000050"
      ctx.fillStyle = "#00000030"
      ctx.beginPath();ctx.arc(control.touch0.hold.x, control.touch0.hold.y, control.stickAreaRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
      ctx.beginPath();ctx.arc(control.touch0.hold.x, control.touch0.hold.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = "#333333"
      ctx.beginPath();ctx.arc(control.touch0.x, control.touch0.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
    }
  }
}


// --- TOUCH ---
var ongoingTouches = {
  0: {color: "#3498DB", x: [0], y: [0]},
  1: {color: "#FAD7A0", x: [0], y: [0]},
  2: {color: "#9B59B6", x: [0], y: [0]},
  3: {color: "#D0ECE7", x: [0], y: [0]},
  4: {color: "#AF601A", x: [0], y: [0]}
}
function touchend(ev) {
  if (ev.cancelable) ev.preventDefault()
  control['touch0'].hold = null
}

addEventListener('touchstart', function(ev) {
  if (document.fullscreenElement == null) { canvas.webkitRequestFullscreen() }
  else if (!settings.debug) { game.start() }

  if (ev.targetTouches.length > 3) { settings.debug = !settings.debug }
  if (settings.debug) { diagnostic.logTouch(ev) }

  // for (var i=0; i < ev.targetTouches.length; i++) {
  //   if (i > 0) break
  //   control['touch'+i].hold = {x: ev.changedTouches[i].pageX + canvas.offsetLeft, y: ev.changedTouches[i].pageY + canvas.offsetTop }
  //   control['touch'+i].x = ev.changedTouches[i].pageX + canvas.offsetLeft
  //   control['touch'+i].y = ev.changedTouches[i].pageY + canvas.offsetTop
  // }
}, false)

addEventListener("touchmove", function(ev) {
  if (settings.debug) { diagnostic.logTouch(ev) }

  control['touch0'].x = ev.changedTouches[0].pageX + canvas.offsetLeft
  control['touch0'].y = ev.changedTouches[0].pageY + canvas.offsetTop

}, false)

addEventListener("touchend", touchend, false)
addEventListener("touchcancel", touchend, false)


// --- MOUSE ---
function onMouseUpdate(e) {
  control.mouse.x = e.x - canvas.offsetLeft
  control.mouse.y = e.y - canvas.offsetTop  
}

addEventListener('mousemove', onMouseUpdate, false)
addEventListener('mouseenter', onMouseUpdate, false)

addEventListener("mousedown", function(e) {
  game.start()
  control.mouse.hold = {x: e.layerX, y: e.layerY }
})
addEventListener("mouseup", function() {
  control.mouse.hold = null
})


// --- KEYBOARD ---
addEventListener("keydown", function(e) {
  // if (e.ctrlKey || e.altKey) return
  // if ('type' in e && e['type'] == 'keydown') { console.log("key pressed '"+e.key+"'") }
  switch (e.key) {
    case settings.keys.left:
      control.keyboard.isGoLeft = true
      break
    case settings.keys.right:
      control.keyboard.isGoRight = true
      break
    case settings.keys.up:
      control.keyboard.isGoUp = true
      break
    case settings.keys.down:
      control.keyboard.isGoDown = true
      break
    case ' ':
      settings.debug = !settings.debug
      break
  }
})
addEventListener("keyup", function(e) {
  switch (e.key) {
    case settings.keys.left:
      control.keyboard.isGoLeft = false
      break
    case settings.keys.right:
      control.keyboard.isGoRight = false
      break
    case settings.keys.up:
      control.keyboard.isGoUp = false
      break
    case settings.keys.down:
      control.keyboard.isGoDown = false
      break
  }
})