const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

var fps = 1000/100
var lps = 1000/100

function lerp(v1, v2, w) {
  return v1 + w * (v2 - v1)
}
function normalize(vector, scale) {
  var norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  if (norm != 0) {
    vector.x = scale * vector.x / norm
    vector.y = scale * vector.y / norm
  }
}
function multiplication(vector, scale) {
  vector.x *= scale
  vector.y *= scale
}


let lastTimeLogic = Date.now()
setInterval(function() {
  let timePass = Date.now() - lastTimeLogic
  
  if (timePass < lps) {
      return
  } else if (timePass > 4 * lps) { // hard mistiming
    lastTimeLogic = Date.now()
      timePass = 4 * lps
  }
  // if(game.state == GameState.MENU) {
    menu.logic(timePass)
  // } else if(game.state == GameState.WORKS)
  // {
    game.logic(timePass)
  // }
}, 10)

let lastTimeDraw = Date.now()
setInterval(function() {
  let timePass = Date.now() - lastTimeDraw
  if (timePass < fps) {
      return
  }
  // diagnostic.test(timePass)

  if(game.state == GameState.MENU) {
    menu.draw(canvasContext, canvas.width, canvas.height, timePass)
  } else if(game.state == GameState.WORKS) {
    game.draw(canvasContext, canvas.width, canvas.height, timePass)
  }

  lastTimeDraw += timePass
}, 10)
