const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


//function to get your webcame to turn on
function getVideo() {
    //this is how you turn on the webcam. 
    //The video truill will turn on 
    //audio to false will keep mic off (turn audio to true to turn on mic)
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    //gives back a promise
    .then(localMediaStream => {
        console.log(localMediaStream);
        // setting source to be localMediaStream
        video.srcObject = localMediaStream;
        video.play();
      
    })
    //how to handle if user does not allow access to webcam
    .catch(err => {
console.error(`On No`, err);
    });
}
//function to take frame from video and paint it to the canvas
function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    //make sure the video will match canvas size
    canvas.width = width;
    canvas.height = height;


    //take image from camera every 16 miliseconds and put into canvas
   return setInterval(() => {
        ctx.drawImage(video, 0, 0 , width, height);
       // take pixels out of array
        let pixels = ctx.getImageData(0,0, width, height);
       // change the pixels
    
        // pixels = redEffect(pixels);
       
        // pixels = rgbSplit(pixels);
       
        // pixels = greenScreen(pixels);
        //add a layer of transparency, and makes those pixel stay for 10 more secs
        ctx.globalAlpha = 0.1;
        //put them back into the array
        ctx.putImageData(pixels, 0, 0);
    }, 16);

}

// function to allow user to take a photo
function takePhoto(){
   //audio sound will play 
   snap.currentTime = 0;
    snap.play();

    //take the data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    //create a link and image to put the data into
    const link = document.createElement('a');
    link.href= data;
    link.setAttribute('download', 'handsome'); //handsome allows you to download the image to your hardrive
    link.innerHTML = `<img src="${data}" alt="Lovely Selfie"/>`
    strip.insertBefore(link, strip.firstChild);


}

//function that adds a red filter to your picture
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED channel (adds more red)
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN channel (takes away green)
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue channel (adds a touch of blue)
    }
    return pixels;
  }
//this function takes the current pixels and splits them to the left and right
  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED channel
      pixels.data[i + 500] = pixels.data[i + 1] // GREEN channel
      pixels.data[i - 550] = pixels.data[i + 2] // Blue channel
    }
    return pixels;
  }

  //a function that adds more green
  function greenScreen(pixels) {
      //will hold minium and maxium green
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
    console.log (levels);
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // removes that color pixel
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }
  


//get video function on page load
getVideo();

// once get video play, this listner will start to paint the canvas
video.addEventListener('canplay', paintToCanvas);