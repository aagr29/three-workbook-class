import { getCatenaryPoints } from "./serverRequests.mjs";
import { displayConductor } from "./displayInformation.mjs";
import { dataObject } from "./catenaryData.mjs";

export async function paintCurve(vector1, vector2, vector3) {
  let x1 = vector1.x;
  let y1 = vector1.y;
  let z1 = vector1.z;
  let x2 = vector2.x;
  let y2 = vector2.y;
  let z2 = vector2.z;
  let x3 = vector3.x;
  let y3 = vector3.y;
  let z3 = vector3.z;
  let payload;
  payload = {
    name: "Adrian",
    point1: [x1, y1, z1],
    point2: [x2, y2, z2],
    point3: [x3, y3, z3],
    end1: [x1, y1],
    end2: [x3, y3],
  };
  let data1 = await getCatenaryPoints(payload);
  if (!data1) {
    console.error("catenary could not be formed from provided points");
    return;
  }
  let coordinates = [];

  for (let i = 0; i < data1.length; i++) {
    coordinates.push(new THREE.Vector3(data1[i][0], data1[i][1], data1[i][2]));
  }

  this.splineCurve = new THREE.CatmullRomCurve3(coordinates);

  const points = this.splineCurve.getPoints(10);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xaaff00 });
  this.splineObject = new THREE.Line(geometry, material);
  this.scene.add(this.splineObject);
  this.splineObject_array.push(this.splineObject);
  this.coordinatesDisplay.push(coordinates);
  this.timestamp.push(Date.now());
  this.countNumber++;
  this.vector = [];
  this.lastCatenary = coordinates;

  this.selectPoints(this.lastCatenary, this.lineThreshold);
  // console.log(this.lastCatenary);
  displayConductor(this.splineObject_array, this.coordinatesDisplay);
  this.data=dataObject(
    this.catenary,
    this.splineObject_array,
    this.vector_array,
    this.coordinatesDisplay,
    this.timestamp,
    this.pointCloudIndex,
    this.poles
  );
  // console.log(x)
  console.log(this.data)
  // return this.data
}

export function selectPoints(coordinates, lineThreshold) {
  let selectedPoints = new Set();

  for (let lineId = 0; lineId < coordinates.length - 1; lineId++) {
    let ray = new THREE.Raycaster(coordinates[lineId], coordinates[lineId + 1]);
    ray.params.Points.threshold = lineThreshold;
    let intersections = ray.intersectObject(this.pcBuffer, true);
    if (intersections && intersections.length > 0) {
      for (let i = 0; i < intersections.length; i++) {
        let index = intersections[i].index;
        selectedPoints.add(index);

        let colors = this.pcBuffer.geometry.attributes.color.array;
        colors[index * 3] = 1;
        colors[index * 3 + 1] = 1;
        colors[index * 3 + 2] = 1;
        this.pcBuffer.geometry.attributes.color.array = colors;
      }
    }
  }

  if (this.lastSelectedPoints) {
    let dropped = droppedPoints(this.lastSelectedPoints, selectedPoints);
    for (let i = 0; i < dropped.length; i++) {
      let index = dropped[i];
      let colors = this.pcBuffer.geometry.attributes.color.array;
      colors[index * 3] = 0;
      colors[index * 3 + 1] = 1;
      colors[index * 3 + 2] = 0;
      this.pcBuffer.geometry.attributes.color.array = colors;
    }
  }
  this.lastSelectedPoints = selectedPoints;
  this.pcBuffer.geometry.attributes.color.needsUpdate = true;
  let variable = Array.from(selectedPoints);
  this.pointCloudIndex.push(variable);
  // console.log(this.pointCloudIndex)
}

function droppedPoints(setA, setB) {
  return [...setA].filter((element) => !setB.has(element));
}
