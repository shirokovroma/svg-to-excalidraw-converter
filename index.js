import svgToEx from "svg-to-excalidraw";

const fileSelector = document.getElementById("source");
const textContainer = document.getElementById("text");
fileSelector.addEventListener("change", async (event) => {
  textContainer.innerText = "Processing...";
  const fileList = event.target.files;
  for (let i = 0; i < fileList.length; i++) {
    const name = fileList[i].name.replace(".svg", ".excalidraw");
    const contents = await readFile(fileList[i]);
    console.log({ contents })
    if (contents) {
      downloadFile(name, contents);
    }
  }
  // clear the input
  event.target.value = "";
  textContainer.innerHTML = "Drag and drop your svg file here <br>or click to select file";
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    if (file.type && file.type !== "image/svg+xml") {
      console.log("File is not SVG.");
      reject("File is not SVG.");
      return;
    }

    const reader = new FileReader();

    reader.readAsText(file);
    reader.addEventListener("load", (event) => {
      const { hasErrors, errors, content } = svgToEx.convert(event.target.result);
      if (hasErrors) {
        console.log(errors);
        reject(errors);
      }
      console.log(content);
      const res = JSON.stringify(content, null, 2)
      console.log({ res });
      resolve(res);
    });
  });
}

function downloadFile(filename, contents) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  return link;
}