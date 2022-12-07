export function displayConductor(variable1, variable2) {
  //display created sphere in div

  let mainContainer = document.getElementById("objectInfo");
  let div = document.createElement("div");
  let hr = document.createElement("hr");
  hr.setAttribute("style", "color: black");
  // console.log('variable1',variable1)
  let i = variable1.length - 1;
  // console.log(variable1[i].uuid)
  div.innerHTML =
    "Type:Conductor " +
    "Id:" +
    variable1[i].uuid +
    " x1:" +
    variable2[i][0].x +
    " y1:" +
    variable2[i][0].y +
    " z1:" +
    variable2[i][0].z +
    " x2:" +
    variable2[i][4].x +
    " y2:" +
    variable2[i][4].y +
    " z2:" +
    variable2[i][4].z +
    " x3:" +
    variable2[i][10].x +
    " y3:" +
    variable2[i][10].y +
    " z3:" +
    variable2[i][10].z;

  mainContainer.appendChild(div);
  mainContainer.appendChild(hr);
}
//display created sphere in div
export function displaySphere(variable) {
  let mainContainer = document.getElementById("objectInfo");
  let div = document.createElement("div");
  let hr = document.createElement("hr");
  for (let i = 0; i < variable.length; i++) {
    div.innerHTML =
      "Type:Sphere " +
      "Id:" +
      variable[i].uuid +
      " x:" +
      variable[i].position.x +
      " y:" +
      variable[i].position.y +
      " z:" +
      variable[i].position.z;
    mainContainer.appendChild(div);
    mainContainer.appendChild(hr);
  }
}

export function displaymodifiedSphere(variable) {
  let mainContainer = document.getElementById("objectInfo");
  let div = document.createElement("div");
  let hr = document.createElement("hr");
  div.innerHTML =
    "Type:Sphere " +
    "Id:" +
    variable.object.uuid +
    " x:" +
    variable.object.position.x +
    " y:" +
    variable.object.position.y +
    " z:" +
    variable.object.position.z;
  mainContainer.appendChild(div);
  mainContainer.appendChild(hr);
}

export function displayPole(variable) {
  let mainContainer = document.getElementById("objectInfo");
  let div = document.createElement("div");
  let hr = document.createElement("hr");
  let i = variable.length - 1;
  div.innerHTML =
    "Type:Pole " +
    "Id:" +
    variable[i].uuid +
    " x_top:" +
    variable[i].geometry.parameters.path.points[0].x +
    " y_top:" +
    variable[i].geometry.parameters.path.points[0].y +
    " z_top:" +
    variable[i].geometry.parameters.path.points[0].z +
    " x_base" +
    variable[i].geometry.parameters.path.points[1].x +
    " y_base:" +
    variable[i].geometry.parameters.path.points[1].y +
    " z_base:" +
    variable[i].geometry.parameters.path.points[1].z;
  mainContainer.appendChild(div);
  mainContainer.appendChild(hr);
}
