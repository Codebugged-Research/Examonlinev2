const videoElem = document.getElementById("videoElem");
const messageElem = document.getElementById("message");
var script = document.createElement('script');
script.src = 'https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';
document.head.appendChild(script);

window.onload = async function () {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(async (stream) => {
        videoElem.srcObject = stream;
        const MODEL_URL = './model/model.json';
        const model = await tf.loadGraphModel(MODEL_URL);
        detection = setInterval(async () => {
            const tfImg = tf.browser.fromPixels(videoElem).resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
            const prediction = await model.predict(tfImg);
            const values = prediction.dataSync();
            const arr = Array.from(values);
            messageElem.innerText = "Real: " + arr[0].toFixed(2) * 100 + "% -- " +"Spoof: " + arr[1].toFixed(2) * 100 + "%"
        }, 1000);

    }).catch((err) => {
        alert(err);
    });
}