'use strict'

function onInit(){
    renderGallery()
}

function renderGallery(){
    
    const images = getImages()

    const strHTML = images.map( img => `
    <img src="${img.url}" class="mems-img" data-img-id="${img.id}" onclick="onImgClick(this, ${img.id})" />
    `).join(' ')
    // console.log('strHTML :>> ', strHTML);
    document.querySelector('.main-gallery').innerHTML = strHTML
}


function onImgClick(elImg, imgId) {
    //hide gallery
    document.querySelector('.gallery').classList.add('hide')
    // show img editor
    document.querySelector('.main-editor-container').classList.remove('hide')
    // change style in header
    document.querySelector('.current-page-link').classList.remove('current-page-link')
    
    // sets gMeme with relevent img
    setNewgMemeImg(elImg, imgId)
    
    renderMeme()
}