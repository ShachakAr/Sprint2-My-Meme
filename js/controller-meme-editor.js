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


// function onMove(ev) {
//     const pos = getEvPos(ev)
//     if (isSizingClicked(pos)) gElCanvas.style.cursor = 'se-resize'
//     else if (getLineClickHover(pos)) {
//         gElCanvas.style.cursor = 'grab'
//         renderMeme()
//     }
//     else if (findStickerIdx(pos)) {
//         gElCanvas.style.cursor = 'grab'
//         renderMeme()
//     }
//     else gElCanvas.style.cursor = 'auto'
//     const isDrag = gCurrDrag ? gCurrDrag.isDrag : false
//     if (isDrag) {
//         const dx = pos.x - gStartPos.x
//         const dy = pos.y - gStartPos.y
//         moveShape(dx, dy)
//         gStartPos = pos
//         renderMeme()
//     } if (gIsSizing) {
//         const dx = pos.x - gStartPos.x
//         const dy = pos.y - gStartPos.y
//         sizeObj(dx, dy)
//         gStartPos = pos
//         renderMeme()
//     }
// }

// function onDown(ev) {
//     const pos = getEvPos(ev)
//     gStartPos = pos

//     gIsSizing = isSizingClicked(pos)
//     if (gIsSizing) {
//     return
//     }

//     if (findStickerIdx(pos)) {
//         gCurrDrag = findStickerIdx(pos)
//         gCurrDrag.isDrag = true
//         return
//     }
//     else if (getLineClickHover(pos)) {
//         gCurrDrag = getLineClickHover(pos)
//         gCurrDrag.isDrag = true
//         return
//     }

//     gLineIsSelected = false
//     gStickerIsSelected = false
//     renderMeme()



// }

// function onUp() {
//     gIsSizing = false
//     if (!gCurrDrag) return
//     gCurrDrag.isDrag = false
// }
