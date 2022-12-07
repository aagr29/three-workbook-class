export function saveAsJson() {
  let result = this.data;
  if (result.length !== 0) {
    console.log("save json function", result.length);
    //   let result = this.data.toJSON();
    let fileName = "myData.json";

    // Create a blob of the data
    let fileToSave = new Blob([JSON.stringify(result)], {
      type: "application/json",
    });

    // Save the file
    saveAs(fileToSave, fileName);
  } else {
    console.log("no data");
  }
}
// blob to json
function saveAs(content, fileName) {
  let a = document.createElement("a");
  let isBlob = content.toString().indexOf("Blob") > -1;
  let url = content;
  if (isBlob) {
    url = window.URL.createObjectURL(content);
  }
  a.href = url;
  a.download = fileName;
  a.click();
  if (isBlob) {
    window.URL.revokeObjectURL(url);
  }
}
