import { displayPole } from "./displayInformation.mjs";

export function createPole(event) {
  this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  this.raycaster.setFromCamera(this.pointer, this.camera);

  const intersections = this.raycaster.intersectObject(this.pcBuffer, true);

  this.intersection = intersections.length > 0 ? intersections[0] : null;

  if (this.intersection == null) {
    console.log("no point found");
    return;
  } else {
    console.log("point found", this.intersection);
  }
  // below code creates pole
  this.poleCoordinates = [];
  let x1 = this.intersection.point.x;
  let y1 = this.intersection.point.y;
  let z1 = this.intersection.point.z;
  let x2 = x1;
  let y2 = y1;
  let z2 = this.zMin;
  this.poleCoordinates.push(new THREE.Vector3(x1, y1, z1));
  this.poleCoordinates.push(new THREE.Vector3(x2, y2, z2));
  let path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x1, y1, z1),
    new THREE.Vector3(x2, y2, z2),
  ]);

  const geometryPole = new THREE.TubeGeometry(path, 64, 0.3, 8, true);
  // TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
  // path — Curve - A 3D path that inherits from the Curve base class. Default is a quadratic bezier curve.
  // tubularSegments — Integer - The number of segments that make up the tube. Default is 64.
  // radius — Float - The radius of the tube. Default is 1.
  // radialSegments — Integer - The number of segments that make up the cross-section. Default is 8.
  // closed — Boolean Is the tube open or closed. Default is false.
  const materialPole = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const meshPole = new THREE.Mesh(geometryPole, materialPole);
  this.poles.push(meshPole);
  // coordinates of start and end of pole can be displayed by below code
  // console.log(meshPole.geometry.parameters.path.points)
  displayPole(this.poles);
  this.scene.add(meshPole);
//   this.selectPoints(this.poleCoordinates, this.poleThreshold);
}
