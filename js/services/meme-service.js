'use strict'

var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2} 
 
var gMeme = { 
    selectedImgId: 0, 
    selectedLineIdx: 0, 
    lines: [] 
} 

function setNewgMemeImg(elImg, imgId){
    const {src} = elImg
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

function initLines(){
    gMeme.lines = [_createLine()]
}

// Called upon by onAddLine
function addLine(){
    let { lines } = gMeme
    lines.push(_createLine())
    gMeme.selectedLineIdx = lines.length - 1
    console.log('lines[gMeme.selectedLineIdx].text :>> ', lines[gMeme.selectedLineIdx].text);
    setInputValue(lines[gMeme.selectedLineIdx].text)
    focusTextLine()
    renderMeme()
}

function getMeme(){
    return gMeme
}

function _createLine(){
    const fontSize = gElCanvas.width / 8
    return   { 
        text: '', 
        fontSize,
        strokeStyle: 'black',
        fillColor: '#f5f5db',
        textAlign: 'left',
        font: 'Impact',
        offsetX: getOffsetX(), 
    }
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

        case 'right':
            rectPos.x = line.xOffset + 10
            rectPos.xOffset = -textWidth - 20
            break;
        case 'left':
            rectPos.x = line.xOffset - 10
            rectPos.xOffset = textWidth + 20
            break;
        default:
            rectPos.x = line.xOffset - textWidth / 2 - 10
            rectPos.xOffset = textWidth + 20


    }
    return rectPos
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

function getLineYOffset(currLine, fontSize) {
    console.log('gettting yoffset')
    switch (currLine) {
        case 0:
            gMeme.lines[currLine].yOffset = fontSize
            break;
        case 1:
            gMeme.lines[currLine].yOffset = (gElCanvas.height / 2) - (fontSize / 2)
            break;
        default:
            gMeme.lines[currLine].yOffset = (gElCanvas.height) - fontSize
    }


    return gMeme.lines[currLine].yOffset
}


function setText(val, renderMeme, attribute) {
    const { selectedLineIdx, lines } = gMeme
    lines[selectedLineIdx][attribute] = val
    console.log('lines[selecteIdx] :>> ', lines[selectedLineIdx]);
    // if (attribute === 'textAlign') lines[selectedLineIdx].xOffset = getXoffset(val)
    renderMeme()
}

function getOffsetX(alignment) {
    let x
    switch (alignment) {
        case 'left':
            x = 5
            break;
        case 'right':
            x = gElCanvas.width - 5
            break;
        case 'center':
            x = gElCanvas.width / 2
            break;
    }
    return x
}
