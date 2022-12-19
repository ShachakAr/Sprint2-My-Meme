'use strict'
const STORAGE_KEY = 'saved_memes'
let gSavedMemes = []
_loadMemesFromStorage()

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}

function getMeme() {
    return gMeme
}

function setNewgMemeImg(elImg, imgId) {
    const { src } = elImg
    gMeme.img = new Image()
    gMeme.img.src = src
    gMeme.selectedImgId = imgId
    gMeme.img.onload = () => {
        setCanvasSize(gMeme.img)
        initLines()
        focusTextLine()
        renderMeme()
    }
}

function initLines() {
    gMeme.lines = [_createLine()]
}

function addLine() {
    let { lines } = gMeme
    lines.push(_createLine())
    gMeme.selectedLineIdx = lines.length - 1
    setInputValue(lines[gMeme.selectedLineIdx].text)
    focusTextLine()
    renderMeme()
}

function deleteLine(renderMeme) {
    let { selectedLineIdx, lines } = gMeme
    if (lines.length === 1) return
    lines.splice(selectedLineIdx, 1)
    selectedLineIdx = lines.length - 1
    setInputValue(lines[selectedLineIdx].text)
    gMeme.selectedLineIdx = selectedLineIdx
    renderMeme()
}

function deleteMeme(id) {
    gSavedMemes.splice(id, 1)
    _saveMemesToStorage()
    renderSavedMemes(gSavedMemes)

}

function saveMeme() {
    gLineIsSelected = false
    document.querySelector('.tooltip .tooltiptext').classList.add('tooltip-visible')
    setTimeout(() => {
        document.querySelector('.tooltip .tooltiptext').classList.remove('tooltip-visible')
    }, 1500);
    document.querySelector('.save-meme-modal-mobile.tooltiptext-mobile').classList.add('tooltiptext-mobile-visible')
    setTimeout(() => {
        document.querySelector('.save-meme-modal-mobile.tooltiptext-mobile').classList.remove('tooltiptext-mobile-visible')
    }, 1500);
    renderMeme()
    gMeme.captureImg = gElCanvas.toDataURL()
    gSavedMemes.push(JSON.stringify(gMeme))
    _saveMemesToStorage()
    gLineIsSelected = true
    renderMeme()
}

function loadSavedMemeToCanvas(savedMeme) {
    const meme = JSON.parse(savedMeme)
    const img = gImages.find(img => img.id === meme.selectedImgId)
    gMeme = meme
    setSavedMeme(`img/gallery/${img.name}`, img.id)
    renderMeme()
}

function setSavedMeme(imgSrc, imgId) {
    gMeme.img = new Image()
    gMeme.img.src = imgSrc
    gMeme.selectedImgId = imgId
    gMeme.img.onload = () => {
        setCanvasSize(gMeme.img)
        setFontAndOffset()
        setFontPos()
        focusTextLine()
    }
}

function switchLines(renderMeme) {
    let { selectedLineIdx, lines } = gMeme
    selectedLineIdx++
    if (selectedLineIdx === lines.length) selectedLineIdx = 0
    gMeme.selectedLineIdx = selectedLineIdx
    setInputValue(lines[selectedLineIdx].text)
    focusTextLine()
    renderMeme()
}

function drawImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        setNewImg(event.target.result, onImageReady)
        renderMeme()
    }
    reader.readAsDataURL(ev.target.files[0])
}

function drawImgFromLocal({ src }, onImageReady, imgId) {
    setNewImg(src, onImageReady, imgId)
    renderMeme()
}

function setNewImg(imgSrc, renderMeme, imgId = 'localImg') {
    gMeme.img = new Image()
    gMeme.img.src = imgSrc
    gMeme.selectedImgId = imgId
    gMeme.img.onload = () => {
        setCanvasSize(gMeme.img)
        linesInit()
        focusTextLine()
    }
}

async function shareCanvas() {
    gLineIsSelected = false
    gStickerIsSelected = false
    renderMeme()
    const dataUrl = gElCanvas.toDataURL();
    const blob = await (await fetch(dataUrl)).blob();
    const filesArray = [
        new File(
            [blob],
            'my-meme.png',
            {
                type: blob.type,
                lastModified: new Date().getTime()
            }
        )
    ];
    const shareData = {
        files: filesArray,
    };
    navigator.share(shareData);
    gLineIsSelected = true;
}

function setCanvasWidth() {
    const pageWidth = getPageWidth()
    if (pageWidth < 1000) gElCanvas.width = pageWidth * 0.9
    else gElCanvas.width = pageWidth * 0.6
}

function setCanvasSize({ width, height }) {
    gElCanvas.height = (height * gElCanvas.width) / width
    const currPageWidth = getPageWidth()
    if (currPageWidth < 500) {
        const currPageHeight = getPageHeight()
        if (gElCanvas.height > currPageHeight * 0.65) {
            gElCanvas.height = currPageHeight * 0.65
            gElCanvas.width = (width * gElCanvas.height) / height
        }
    } else if (gElCanvas.height > 780) {
        gElCanvas.width = 500
        gElCanvas.height = (height * gElCanvas.width) / width
    }
}

function setFontPos() {
    gMeme.lines.forEach(line => {
        if (!line.xRatio) return
        line.xOffset = line.xRatio * gElCanvas.width
        line.yOffset = line.yRatio * gElCanvas.height
    })
}

function setFontSize() {
    gMeme.lines.forEach(line => {
        line.fontSize = gElCanvas.width * line.fontRatio

    })
}

function getRectPos() {

    const line = gMeme.lines[gMeme.selectedLineIdx]
    console.log('line :>> ', line);
    const rectPos = {
        y: line.yOffset + 15,
        yOffset: -line.fontSize - 15,
        x: 0,
        xOffset: 0
    }

    const textWidth = line.text ? gCtx.measureText(line.text).width : gCtx.measureText('Type your text').width
    switch (line.textAlign) {

        case 'left':
            rectPos.x = line.xOffset - 10
            rectPos.xOffset = textWidth + 20
            break;
        case 'right':
            rectPos.x = line.xOffset + 10
            rectPos.xOffset = -textWidth - 20
            break;
        default:
            rectPos.x = line.xOffset - textWidth / 2 - 10
            rectPos.xOffset = textWidth + 20
            break;
    }

    return rectPos
}

function moveShape(dx, dy) {
    gCurrDrag.xOffset += dx
    gCurrDrag.yOffset += dy
}

function getLineClickHover(clickedPos) {

    const lineClickedIdx = findLineByPos(clickedPos)
    if (lineClickedIdx === -1) return

    gLineIsSelected = true

    gMeme.selectedLineIdx = lineClickedIdx

    const lineClicked = gMeme.lines[lineClickedIdx]
    focusTextLine()
    setInputValue(gMeme.lines[gMeme.selectedLineIdx].text)
    return lineClicked
}

function findLineByPos(clickedPos) {

    return gMeme.lines.findIndex(line => {
        switch (line.textAlign) {
            case 'right':
                return clickedPos.x < (line.xOffset + 10) && clickedPos.x > (line.xOffset - line.width) - 10 &&
                    clickedPos.y < line.yOffset + 15 && clickedPos.y > (line.yOffset - line.fontSize + 14) - 15
            case 'left':
                return clickedPos.x > (line.xOffset) - 10 && clickedPos.x < (line.width - line.xOffset) + 10 &&
                    clickedPos.y < line.yOffset + 15 && clickedPos.y > (line.yOffset - line.fontSize + 14) - 15
            default:
                return clickedPos.x < (line.xOffset + line.width / 2) + 10 && clickedPos.x > (line.xOffset - line.width / 2) - 10 &&
                    clickedPos.y < line.yOffset + 15 && clickedPos.y > (line.yOffset - line.fontSize + 14) - 15
        }
    })
}

function drawArc(x, y) {
    gCtx.setLineDash([]);
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.beginPath();
    gCtx.arc(x, y, 10, 0, 2 * Math.PI);
    gCtx.stroke()
    gCtx.fill();
    gCirclePos.x = x
    gCirclePos.y = y
}

function setText(val, attribute) {
    const { selectedLineIdx, lines } = gMeme
    lines[selectedLineIdx][attribute] = val
    // console.log('lines[selecteIdx] :>> ', lines[selectedLineIdx]);
    if (attribute === 'textAlign') lines[selectedLineIdx].xOffset = getXOffset(val)
}

function getXOffset(alignment) {
    let x
    switch (alignment) {
        case 'left':
            x = 5
            break;
        case 'right':
            x = gElCanvas.width - 5
            break;
        default:
            x = gElCanvas.width / 2
            break;
    }
    return x
}

function getLineYOffset(currLine, fontSize) {
    switch (currLine) {
        case 0:
            gMeme.lines[currLine].yOffset = gElCanvas.height / 25 + fontSize
            break;
        case 1:
            gMeme.lines[currLine].yOffset = gElCanvas.height - (gElCanvas.height / 25) - fontSize / 2
            break;
        default:
            gMeme.lines[currLine].yOffset = (gElCanvas.height / 2) + fontSize / 3
    }

    return gMeme.lines[currLine].yOffset
}

function increaseFont(isTrue, renderMeme) {
    const { selectedLineIdx, lines } = gMeme
    lines[selectedLineIdx].fontSize *= isTrue ? 1.05 : 0.95
    renderMeme()
}

function _loadMemesFromStorage() {
    let mems = loadFromStorage(STORAGE_KEY)
    if (!mems || !mems.length) return
    gSavedMemes = mems
}

function _createLine() {
    const fontSize = gElCanvas.width / 8
    return {
        text: '',
        fontSize,
        strokeStyle: 'black',
        fillColor: '#f5f5db',
        textAlign: 'center',
        font: 'Impact',
        xOffset: getXOffset(),
        isDrag: false,
    }
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}
