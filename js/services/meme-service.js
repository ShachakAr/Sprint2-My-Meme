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
        // console.log('src :>> ', src);
        gMeme.selectedImgId = imgId
        console.log('gMeme.img :>> ', gMeme.img.height);
        gMeme.img.onload = () => {
            setCanvasSize(gMeme.img)
            addLine()
            renderMeme()
        }
}

function setCanvasSize({width, height}) {
    gElCanvas.height = height
    gElCanvas.width = width
}

function addLine(){
    // if (!gMeme.lines) gMeme.lines = [_createLine()] 
    const { lines } = gMeme
    lines.push(_createLine())
    gMeme.selectedLineIdx = lines.length - 1
}

function getMeme(){
    return gMeme
}

function _createLine(){
    return   { 
        txt: 'hi', 
        fontSize: 20,
        strokeStyle: 'black',
        fillColor: '#f5f5db',
        textAlign: 'left', 
    }
}
