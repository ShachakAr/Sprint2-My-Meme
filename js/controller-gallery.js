'use strict'

function onInit(){
    renderGallery()
    //TODO: render key words
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
    // document.querySelector('.current-page-link').classList.remove('current-page-link')
    
    // sets gMeme with relevent img
    setNewgMemeImg(elImg, imgId)
    
    renderMeme()
}

function onGalleryClick(){
    document.querySelector('.main-editor-container').classList.add('hide')
    document.querySelector('.gallery').classList.remove('hide')
    // document.querySelector('body').classList.remove('menu-open')

    if(document.querySelector('.current-page-link'))
    document.querySelector('.current-page-link').classList.remove('current-page-link')
    document.querySelector('.nav-link.nav-gallery').classList.add('current-page-link')
    
}