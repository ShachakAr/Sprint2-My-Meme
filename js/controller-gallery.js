'use strict'

function onInit(){
    renderGallery()
    renderKeywords(gSelectedKeywords)
}

function renderGallery(images){
    if(!images) images = getImages()
    const strHTML = images.map( img => `
    <img src="${img.url}" class="mems-img" data-img-id="${img.id}" onclick="onImgClick(this, ${img.id})" />
    `).join(' ')
    document.querySelector('.main-gallery').innerHTML = strHTML
}

function onImgClick(elImg, imgId) {
    //hide gallery
    document.querySelector('.gallery').classList.add('hide')
    // show img editor
    document.querySelector('.main-editor-container').classList.remove('hide')
    // change marked title in header
    document.querySelector('.current-page-link').classList.remove('current-page-link')
    // sets gMeme with relevent img
    setNewgMemeImg(elImg, imgId)
    renderMeme()
}

function renderKeywords(keywords) {
    const strHTML = keywords.map(({ keyword, count }) => `
    <span class="${keyword}" onclick="onKeywordClick('${keyword}')" style="font-size:${1 + count * 0.3}em">${keyword}</span>
    `).join(' ')
    document.querySelector('.gallery .keywords').innerHTML = strHTML
}

function onKeywordClick(keyword) {
    document.querySelector('.search-input').value = keyword
    increaseCount(keyword)
}

function onMoreKeywords(elArrow) {
    gIsAllKeywords = !gIsAllKeywords
    pickKeywords()
    document.querySelector('.gallery-header').classList.toggle('open-content')
    elArrow.classList.toggle('move-down')
    elArrow.classList.toggle('rotate')
}

function onSetFilterByTxt(txt) {
    setFilterByTxt(txt)
}

function onUploadClick() {
    document.querySelector('.file-input').click()
    onImgClick()
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}

function onGalleryClick(){
    // Hide all
    document.querySelector('.main-editor-container').classList.add('hide')
    document.querySelector('.saved-mems-container').classList.add('hide')
    // Show gallery
    document.querySelector('.gallery').classList.remove('hide')
    document.querySelector('body').classList.remove('menu-open')

    if(document.querySelector('.current-page-link'))
    document.querySelector('.current-page-link').classList.remove('current-page-link')
    document.querySelector('.nav-link.nav-gallery').classList.add('current-page-link')
    renderSavedMemes(gSavedMemes)
}
