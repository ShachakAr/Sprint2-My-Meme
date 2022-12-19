'use strict'

const gImages = _createImages()
const gKeywords = getAllKeywords()
const gKeywordCountMap = gKeywords.map(keyword => ({ keyword, count: getRandomInt(0, 4) }))
const gSelectedKeywords = getSelectedKeywords()
let gIsAllKeywords = false

function getImages() {
    return gImages
}

function setFilterByTxt(txt) {
    if (!txt) {
        renderGallery()
        return
    }
    const filteredImg = gImages.filter(img => img.keywords.find(keyword => {
        return keyword.toLocaleLowerCase().includes(txt.toLowerCase())
    }))
    renderGallery(filteredImg)
}

// Returns the keywords extracted from the imgs
function getAllKeywords() {
    // Long string of img keywords
    let keywords = gImages.map(img => img.keywords.join(' '))
    //Join all the strs, and splits into single words
    let uniqueList = keywords.join(' ').split(' ')
    uniqueList = [...new Set(uniqueList)]
    return uniqueList
}

function getSelectedKeywords() {
    const keywords = [...gKeywordCountMap]
    const selectedKeywords = []
    for (let i = 0; i < 5; i++) {
        selectedKeywords.push(keywords.splice(getRandomInt(0, keywords.length), 1)[0])
    }
    return selectedKeywords
}

function increaseCount(keyword) {
    const keywordClicked = gKeywordCountMap.find(item => item.keyword === keyword)
    if (keywordClicked.count < 7) keywordClicked.count++
    pickKeywords()
    setFilterByTxt(keyword)
}

function pickKeywords() {
    if (gIsAllKeywords) renderKeywords(gKeywordCountMap)
    else renderKeywords(gSelectedKeywords)
} 

function _createImages() {
    return [
        {
            id: 1,
            url: 'images/gallery/1.jpg',
            keywords: ['trump', 'politics', 'news', 'explain']
        },
        {
            id: 2,
            url: 'images/gallery/2.jpg',
            keywords: ['dog', 'puppies', 'friendship']
        },
        {
            id: 3,
            url: 'images/gallery/3.jpg',
            keywords: ['dog', 'puppies', 'friendship', 'baby', 'sleep', 'relax']
        },
        {
            id: 4,
            url: 'images/gallery/4.jpg',
            keywords: ['cat', 'sleep', 'relax', 'pet']
        },
        {
            id: 5,
            url: 'images/gallery/5.jpg',
            keywords: ['succes', 'win', 'yes', 'baby']
        },
        {
            id: 6,
            url: 'images/gallery/6.jpg',
            keywords: ['succes', 'win', 'yes','man', 'crazy', 'explain', 'funny']
        },
        {
            id: 7,
            url: 'images/gallery/7.jpg',
            keywords: ['baby', 'surprise', 'shock', 'funny']
        },
        {
            id: 8,
            url: 'images/gallery/8.jpg',
            keywords: ['man', 'smile', 'crazy', 'funny', 'hat']
        },
        {
            id: 9,
            url: 'images/gallery/9.jpg',
            keywords: ['baby','child', 'scam', 'laugh', 'funny']
        },
        {
            id: 10,
            url: 'images/gallery/10.jpg',
            keywords: ['man', 'smile', 'obama', 'laugh']
        },
        {
            id: 11,
            url: 'images/gallery/11.jpg',
            keywords: ['man', 'surprise', 'shock', 'funny','kiss', 'sport']
        },
        {
            id: 12,
            url: 'images/gallery/12.jpg',
            keywords: ['man', 'you', 'pointing', 'reveal', 'eyes']
        },
        {
            id: 13,
            url: 'images/gallery/13.jpg',
            keywords: ['man', 'suit', 'smile', 'salut', 'cheers', 'celebrate']
        },
        {
            id: 14,
            url: 'images/gallery/14.jpg',
            keywords: ['man', 'serious', 'matrix','movie', 'morphius']
        },
        {
            id: 15,
            url: 'images/gallery/15.jpg',
            keywords: ['man', 'zero', 'explain','movie', 'lord of the rings']
        },
        {
            id: 16,
            url: 'images/gallery/16.jpg',
            keywords: ['man', 'funny', 'laugh', 'ridiculous']
        },
        {
            id: 17,
            url: 'images/gallery/17.jpg',
            keywords: ['man', 'suit', 'putin', 'victory']
        },
        {
            id: 18,
            url: 'images/gallery/18.jpg',
            keywords: ['toy', 'friendship', 'toy story', 'friend', 'movie']
        }
    ]
}