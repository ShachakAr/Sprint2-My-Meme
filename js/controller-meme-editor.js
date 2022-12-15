'use strict'

let gElCanvas
let gCtx
let gLineIsSelected = true
let gCurrPageWidth = getPageWidth()
let gCirclePos = {}
let gDirection = "ltr"
let gStartPos
gElCanvas = document.querySelector('.main-canvas')
gCtx = gElCanvas.getContext('2d')
addMouseListeners()
addTouchListeners()
setCanvasWidth()


window.addEventListener("resize", () => {

    if (gCurrPageWidth === getPageWidth()) return
    if (getMeme().lines.length === 0) return
    setCanvasWidth()
    setCanvasSize(gMeme.img)
    setFontPos()
    setFontSize()
    renderMeme()
});

// Strech img to canvas size, and add lines
function renderMeme() {
    // render img to canvas with a line of text
    const { img, lines } = getMeme()
    console.log('lines :>> ', lines);
    renderImg(img)
    renderTextInput(lines)
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderTextInput(memeTextLines) {
    memeTextLines.forEach((line, idx) => {
        // console.log('line :>> ', line.offsetX);
        let { fillColor, fontSize, strokeStyle, textAlign, text, font, yOffset, xOffset } = line
        // console.log('xOffset :>> ', xOffset);
        // console.log('yOffset :>> ', yOffset);
        line.xRatio = xOffset / gElCanvas.width
        line.yRatio = yOffset / gElCanvas.height
        line.fontRatio = fontSize / gElCanvas.wi
        if (!yOffset) yOffset = getLineYOffset(idx, fontSize)
        if (text === '') text = 'Type your text'
        gCtx.fillStyle = fillColor
        gCtx.font = `${fontSize} ${font}`
        gCtx.strokeStyle = 'white'
        gCtx.textAlign = textAlign
        gCtx.textBaseLine = textAlign
        gCtx.lineJoin = 'round'
        gCtx.letterSpacing = '5px'

        // create the text border
        // console.log('idx :>> ', idx);
        // console.log('gMeme.selectedLineIdx :>> ', gMeme.selectedLineIdx);
        if (idx === gMeme.selectedLineIdx) {
            const rectPos = getRectPos()
            console.log('rectPos :>> ', rectPos);
            // rectPos.x = 0
            gCtx.lineWidth = 3
            gCtx.setLineDash([10, 10])
            if (gLineIsSelected) {
                gCtx.strokeRect(rectPos.x, rectPos.y, rectPos.xOffset, rectPos.yOffset)
                drawArc(rectPos.x + rectPos.xOffset, rectPos.y)
            }

        }

        gCtx.fillStyle = 'white'
        gCtx.strokeStyle = strokeStyle
        gCtx.setLineDash([]);
        gCtx.lineWidth = 7
        gCtx.strokeText(text, xOffset, yOffset)
        gCtx.fillText(text, xOffset, yOffset)

        if (gCtx.measureText(text).width > gElCanvas.width) {
            gMeme.lines[idx].fontSize = fontSize * 0.9
            renderMeme()
        }
        gMeme.lines[idx].width = gCtx.measureText(text).width
    })
}


function onTextInput(ev) {
    setText(ev.target.value, renderMeme, 'text')
}

function onAddLine(){
    addLine()
    renderMeme()
}

function focusTextLine() {
    if (getPageWidth() < 550) return
    document.querySelector('.text-input').click()
}

function setInputValue(val) {
    document.querySelector('.mems-text').value = ''
    document.querySelector('.mems-text').value = val
}


function addMouseListeners() {
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mouseup', onUp)
}


function addTouchListeners() {
    // gElCanvas.addEventListener('touchmove', onMove)
    // gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchend', onUp)
}



