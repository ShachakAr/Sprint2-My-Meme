'use strict'

let gElCanvas
let gCtx

gElCanvas = document.querySelector('.main-canvas')
gCtx = gElCanvas.getContext('2d')
// addMouseListeners()
// addTouchListeners()
//TODO: set canvas width
setCanvasWidth()


// window.addEventListener("resize", () => {

// })

function renderMeme(imgId){
    // render img to canvas with a line of text
    const {img, lines} = getMeme()
    console.log('img :>> ', img);
    renderImg(img)
    console.log('lines :>> ', lines);
    // renderTextInput(lines)
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function setCanvasWidth(){
    const pageWidth = getPageWidth()
    if (pageWidth < 1000) gElCanvas.width = pageWidth * 0.9
    else gElCanvas.width = pageWidth * 0.6
}


function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}


function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}



