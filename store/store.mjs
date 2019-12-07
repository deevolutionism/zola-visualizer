export const store = {
    vizStyles: ['lounge'],
    autoplay: true,
    loop: false,
    barWidth: 1,
    barHeight: 10,
    barSpacing: 10,
    radius: 300,
    xOff: 500,
    yOff: 500,
    style: 'lounge',
    AV: null,
}

// export default store



window.addEventListener('radius', e => {
    store.radius = e.detail.data
    if(store.AV) {
        store.AV.radius = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})
window.addEventListener('bar width', e => {
    store.barWidth = e.detail.data
    if(store.AV) {
        store.AV.barWidth = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})
window.addEventListener('bar height', e => {
    store.barHeight = e.detail.data
    if(store.AV) {
        store.AV.barHeight = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})
window.addEventListener('play', e => {
    store.autoplay = e.detail.data
    if(store.AV) {
        store.AV.radius = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})
window.addEventListener('x offset', e => {
    store.xOff = e.detail.data
    if(store.AV) {
        store.AV.xOff = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})
window.addEventListener('y offset', e => {
    store.yOff = e.detail.data
    if(store.AV) {
        store.AV.yOff = parseInt(e.detail.data)
        window.dispatchEvent(new CustomEvent('updateViz'))
    }
})

