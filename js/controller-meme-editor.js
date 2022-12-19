'use strict'

let gElCanvas
let gCtx
let gLineIsSelected = true
let gCurrPageWidth = getPageWidth()
let gCirclePos = {}
// Option to add heb
let gDirection = "ltr"
let gStartPos
let gCurrDrag
let gIsSizing
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

gElCanvas = document.querySelector('.main-canvas')
gCtx = gElCanvas.getContext('2d')
addMouseListeners()
addTouchListeners()
setCanvasWidth()

window.addEventListener("resize", () => {
console.log('resizing')
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
    // Render img to canvas 
    const { img, lines } = getMeme()
    renderImg(img)
    // Add text lines
    renderTextInput(lines)
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderTextInput(textLines) {
    textLines.forEach((line, idx) => {
        let { fontSize, fillColor, text, yOffset, xOffset, strokeStyle, textAlign, font } = line

        line.xRatio = xOffset / gElCanvas.width
        line.yRatio = yOffset / gElCanvas.height
        line.fontRatio = fontSize / gElCanvas.width
        if (!yOffset) yOffset = getLineYOffset(idx, fontSize)
        if (!text) text = 'Type Your Text'
        gCtx.strokeStyle = 'white'
        gCtx.fillStyle = fillColor
        gCtx.textAlign = textAlign
        gCtx.textBaseline = textAlign
        gCtx.lineJoin = 'round'
        gCtx.letterSpacing = '5px'

        gCtx.font = `${fontSize}px ${font}`
        if (idx === gMeme.selectedLineIdx) {
            const rectPos = getRectPos()
            gCtx.lineWidth = 3
            gCtx.arc(rectPos.x, rectPos.y, 10, 0, 2 * Math.PI);
            gCtx.setLineDash([10, 10]);
            if (gLineIsSelected) {
                gCtx.strokeRect(rectPos.x, rectPos.y, rectPos.xOffset, rectPos.yOffset)
                drawArc(rectPos.x + rectPos.xOffset, rectPos.y)
            }

        }

        gCtx.strokeStyle = 'white'
        gCtx.fillStyle = fillColor
        gCtx.direction = gDirection
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
    setText(ev.target.value, 'text')
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onImgInput(ev) {
    drawImageFromInput(ev, renderMeme)
}

function onAlignFont(val) {
    setText(val, 'textAlign')
}

function onSwitchLines() {
    switchLines(renderMeme)
}

function onSetFont(el) {
    el.style.fontFamily = el.value
    setText(el.value, 'font')
    renderMeme()
}

function onDeleteLine() {
    deleteLine(renderMeme)
}

function onIncreaseFont(isTrue) {
    if (gLineIsSelected) increaseFont(isTrue, renderMeme)
    else increaseSticker(isTrue, renderMeme)
}

function onColorInput(ev) {
    setText(ev.target.value, ev.target.name)
}

function onDownloadImg(elLink) {
    gLineIsSelected = false
    renderMeme()
    const imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
    gLineIsSelected = true
}

function onSaveMeme() {
    saveMeme()
}

function onLoadSavedMemeToCanvas(savedMeme) {
    document.querySelector('.main-editor-container').classList.remove('hide')
    document.querySelector('.saved-mems-container').classList.add('hide')
    document.querySelector('.current-page-link').classList.remove('current-page-link')
    loadSavedMemeToCanvas(savedMeme)
}

function onShare() {
    shareCanvas()
}

function onUp() {
    gIsSizing = false
    if (!gCurrDrag) return
    gCurrDrag.isDrag = false
}

function onMove(ev) {
    const pos = getEventPos(ev)
    if (isSizingClicked(pos)) gElCanvas.style.cursor = 'se-resize'
    else if (getLineClickHover(pos)) {
        gElCanvas.style.cursor = 'grab'
        renderMeme()
    }
   
    else gElCanvas.style.cursor = 'auto'
    const isDrag = gCurrDrag ? gCurrDrag.isDrag : false
    if (isDrag) {
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveShape(dx, dy)
        gStartPos = pos
        renderMeme()
    } if (gIsSizing) {
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        sizeObj(dx, dy)
        gStartPos = pos
        renderMeme()
    }
}

function onDown(ev) {
    const pos = getEventPos(ev)
    gStartPos = pos

    gIsSizing = isSizingClicked(pos)
    if (gIsSizing) {
        return
    }
    else if (getLineClickHover(pos)) {
        gCurrDrag = getLineClickHover(pos)
        gCurrDrag.isDrag = true
        return
    }
    gLineIsSelected = false
    renderMeme()
}

function getEventPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVENTS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isSizingClicked(pos) {
    return (pos.x < gCirclePos.x + 20 && pos.x > gCirclePos.x - 25 &&
        pos.y < gCirclePos.y + 20 && pos.y > gCirclePos.y - 20)
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
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}









