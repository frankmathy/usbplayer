document.addEventListener("DOMContentLoaded", function () {
  const videoPlayer = document.getElementById("videoPlayer");
  const fileList = document.getElementById("fileList");
  const supportedVideoFormats = ["mp4", "webm", "ogg", "mkv", "avi"];

  // Vidaa API: Checking for USB devices
  vidaa.fileSystem
    .getDrives()
    .then((drives) => {
      const usbDrives = drives.filter((drive) => drive.type === "usb");
      if (usbDrives.length === 0) {
        alert("No USB drives found.");
        return;
      }
      const usbDrive = usbDrives[0]; // Use the first USB drive found
      loadVideosFromUSB(usbDrive);
    })
    .catch((err) => {
      console.error("Error accessing USB drives:", err);
    });

  function loadVideosFromUSB(usbDrive) {
    vidaa.fileSystem
      .readDirectory(usbDrive.mountPath)
      .then((files) => {
        files.forEach((file) => {
          const fileExtension = file.name.split(".").pop().toLowerCase();
          if (supportedVideoFormats.includes(fileExtension)) {
            const listItem = document.createElement("li");
            listItem.textContent = file.name;
            listItem.addEventListener("click", () => playVideo(usbDrive.mountPath + "/" + file.name));
            fileList.appendChild(listItem);
          }
        });
      })
      .catch((err) => {
        console.error("Error reading USB directory:", err);
        alert("Error reading USB directory");
      });
  }

  function playVideo(filePath) {
    videoPlayer.src = filePath;
    videoPlayer.play();
  }
});
