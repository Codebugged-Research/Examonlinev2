const videoElem = document.getElementById("videoElem");
const canvasRef = document.getElementById("canvasRef");
const im = document.getElementById("im");

const labelMap = {
    1: { name: 'Book', color: 'red' },
    2: { name: 'Phone', color: 'yellow' },
}

//book 0.8 phone 0.6
// Define a drawing function
drawRect = (boxes, classes, scores, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i <= boxes.length; i++) {
        if (classes[i] === 1 && boxes[i] && scores[i] > 0.8) {
            const [y, x, height, width] = boxes[i]
            const text = classes[i]
            console.log(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100,);
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 2
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x, y);
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
            ctx.stroke()
        } else if (classes[i] === 2 && boxes[i] && scores[i] > 0.8) {
            const [y, x, height, width] = boxes[i]
            const text = classes[i]
            console.log("Phone" + ' - ' + Math.round(scores[i] * 100) / 100,);
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 2
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x, y);
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
            ctx.stroke()
        }
    }
}

window.onload = async function () {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(async (stream) => {
        videoElem.srcObject = stream;
        const MODEL_URL = './model/model.json';
        let model;
        model = await tf.loadGraphModel(MODEL_URL);
        detection = setInterval(async () => {
            await detect(model);
        }, 500);

    }).catch((err) => {
        alert(err);
    });
}

const detect = async (net) => {
    const videoWidth = videoElem.videoWidth;
    const videoHeight = videoElem.videoHeight;
    canvasRef.width = videoElem.videoWidth;
    canvasRef.height = videoElem.videoHeight;
    // 4. TODO - Make Detections

    const img = tf.browser.fromPixels(videoElem);
    const resized = tf.image.resizeBilinear(img, [640, 640]);
    const casted = resized.cast("int32");
    const expanded = casted.expandDims(0);
    const obj = await net.executeAsync(expanded);

    //final1
    // const boxes = await obj[0].array(); //
    // const classes = await obj[2].array(); //Classes  
    // const scores = await obj[3].array();

    //final3
    const boxes = await obj[6].array(); //
    const classes = await obj[2].array(); //Classes  
    const scores = await obj[3].array();
    // console.log(await obj[3].array());
    // Draw mesh
    const ctx = canvasRef.getContext("2d");

    //   ctx.drawImage(videoElem, 0, 0, canvasRef.width, canvasRef.height);

    drawRect(
        boxes[0],
        classes[0],
        scores[0],
        videoWidth,
        videoHeight,
        ctx
    );



    tf.dispose(img);
    tf.dispose(resized);
    tf.dispose(casted);
    tf.dispose(expanded);
    tf.dispose(obj);

};