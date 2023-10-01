var audio = false;
var video = true;
var timer;
const { name, room, friend, friendname } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
document.getElementById("my_id").innerHTML = room;
document.getElementById("stop").style.display = "none";
document.getElementById("id").value = friend;
document.getElementById("my_name").innerHTML = name;
const peer = new Peer(room, {
  host: "localhost",
  port: 3000,
  path: "/peerjs/myapp",
});

const sample_video = document.getElementById("sample");
const my_camera = document.getElementById("my_camera");
const friend_cam = document.getElementById("friend_cam");

const download_link = document.getElementById("download_link");

var recordedBlobs = [];

///////////////////for recording media////////////////////////////
var options = { mimeType: "video/webm;codecs=vp9,opus" };
if (!MediaRecorder.isTypeSupported(options.mimeType)) {
  console.error(${options.mimeType} is not supported);
  options = { mimeType: "video/webm;codecs=vp8,opus" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(${options.mimeType} is not supported);
    options = { mimeType: "video/webm" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(${options.mimeType} is not supported);
      options = { mimeType: "" };
    }
  }
}
var mediaRecorder;

function start_recording() {
  var time = 0;
  timer = setInterval(() => {
    time++;
    document.getElementById("status").innerHTML =
      parseInt(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60 + " Recording...";
  }, 1000);
  document.getElementById("stop").style.display = "inline";
  document.getElementById("record").style.display = "none";
  document.getElementById("status").style.display = "inline";
  document.getElementById("status").innerHTML = "Recording...";
  recordedBlobs = [];
  options = { mimeType: "video/webm;codecs=vp9,opus" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(${options.mimeType} is not supported);
    options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(${options.mimeType} is not supported);
      options = { mimeType: "video/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(${options.mimeType} is not supported);
        options = { mimeType: "" };
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(friend_cam.srcObject, options);
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    errorMsgElement.innerHTML = Exception while creating MediaRecorder: ${JSON.stringify(e)};
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder, "with options", options);

  mediaRecorder.onstop = (event) => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log("MediaRecorder started", mediaRecorder);
}

function stop_recording() {
  clearInterval(timer);
  document.getElementById("status").style.display = "none";
  document.getElementById("stop").style.display = "none";
  document.getElementById("record").style.display = "inline";
  console.log("stop recording up");
  mediaRecorder.stop();
  console.log("stop recording down");
  document.getElementById("status").innerHTML = "Stopping....";
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    console.log("inside handle data");
    recordedBlobs.push(event.data);
    document.getElementById("status").innerHTML = "";
  }
}

function download() {
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  my_camera.src = url;
  a.style.display = "none";
  a.href = url;
  a.download = "RecordedVideo.webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
///////////////////////////////////////////

/////copy to clipboard function
function copy_id() {
  var copyText = document.getElementById("my_id");
  var inp = document.createElement("input");
  document.getElementById("body").appendChild(inp);
  inp.value = copyText.innerHTML;
  inp.select();
  inp.setSelectionRange(0, 99999);
  document.execCommand("copy");
  inp.remove();
  myFunction(copyText.innerHTML);
}

document.getElementById("title").innerHTML = "Hello " + name + " !";

peer.on("open", function (id) {
  console.log("My peer ID is: " + id);
});

var call;

peer.on("call", function (calll) {
  document.getElementById("ring").play();

  setTimeout(() => {
    var check_it = confirm("Receive the call");

    if (check_it) {
      document.getElementById("ring").pause();
      const startChat = async () => {
        console.log("received");
        calll.answer(sample_video.srcObject);
        w3_open();
        document.getElementById("friend_name").innerHTML = friendname;
        calll.on("stream", function (stream) {
          friend_cam.srcObject = stream;
        });
        calll.on("close", function () {
          alert("The video call has finished");
          w3_close();
        });
        call = calll;
      };

      startChat();
    } else {
      call = calll;
      calll.close();
      alert("Call declined!");
      w3_close();
      document.getElementById("ring").pause();
    }
  }, 2000);
});

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video, audio })
    .then(function (stream) {
      sample_video.srcObject = stream;
      my_camera.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

function myFunction(st) {
  var x = document.getElementById("snackbar");
  x.innerHTML = st + " copied to clipboard.";
  x.className = "show";

  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function w3_open() {
  document.getElementById("mySidebar").style.width = "100%";
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

document.getElementById("control_bar").addEventListener("click", function () {
  var audio_toggle = document.getElementById("audio").checked;
  var video_toggle = document.getElementById("video").checked;
  var sharing_toggle = document.getElementById("share").checked;
  audio = audio_toggle;
  video = video_toggle;
  if (sharing_toggle == true) {
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video, audio })
        .then(function (stream) {
          sample_video.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  } else {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then(function (stream) {
          sample_video.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }
});

function make_call() {
  my_camera.srcObject = sample_video.srcObject;
  var id = document.getElementById("id").value;
  call = peer.call(id, sample_video.srcObject);

  call.on("stream", function (stream) {
    friend_cam.srcObject = stream;
  });

  call.on("close", function () {
    alert("The video call has finished");
    w3_close();
  });
}

function hangup() {
  call.close();
  w3_close();
}

function screenshot() {
  const canvas = document.createElement("canvas");
  const img = document.getElementById("img");
  canvas.width = friend_cam.videoWidth;
  canvas.height = friend_cam.videoHeight;

  canvas.getContext("2d").drawImage(friend_cam, 0, 0);

  let dataUrl = canvas.toDataURL("image/png");
  img.src = dataUrl;

  var hrefElement = document.createElement("a");
  hrefElement.href = dataUrl;
  document.body.append(hrefElement);
  hrefElement.download = "ScreenShot$.png";

  hrefElement.click();
  hrefElement.remove();
  img.style.display = "none";
}

var index = 0;

function screen_share() {
  if (index % 2 == 0) {
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video, audio })
        .then(function (stream) {
          my_camera.srcObject = stream;
          var id = document.getElementById("id").value;

          call = peer.call(id, my_camera.srcObject);
          document.getElementById("share_screen").src = "./share (1).png";
          index++;
        })
        .catch(function (error) {
          console.log("Something went wrong!" + error);
        });
    }
  } else {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then(function (stream) {
          my_camera.srcObject = stream;
          var id = document.getElementById("id").value;

          call = peer.call(id, my_camera.srcObject);
          document.getElementById("share_screen").src = "./share.png";
          index++;
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }
}
