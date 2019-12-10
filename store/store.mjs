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

const updateParams = (param, val, eventName) => {
        console.log('update', param, val, eventName)
        try {
            store.AV[param] = val
        } catch (e) {
            // no AV yet
        }
        store[param] = val
        window.dispatchEvent(new CustomEvent(eventName))
}

window.addEventListener('update-params', e => {
        updateParams(e.detail.param, parseInt(e.detail.data), 'updateViz')
})

