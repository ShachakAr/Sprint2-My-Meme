'use strict'

const gImages = _createImages()

function getImages(){
    return gImages
}

function _createImages() {
    return [
        {
         id: 1,
         url: 'images/gallery/1.jpg',
         keywords: ['trump', 'politics','news']   
        },
        {
         id: 2,
         url: 'images/gallery/2.jpg',
         keywords: ['dogs', 'puppies','friendship']   
        }
    ]
}