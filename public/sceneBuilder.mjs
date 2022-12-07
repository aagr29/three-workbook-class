import { generatePointcloud } from "./pointCloud.mjs";
import { generateBasepoints } from "./basePlane.mjs";
import { paintCurve, selectPoints } from "./pointModifiers.mjs";
import { MapControls, OrbitControls } from "./orbitControl.mjs";
import { getPoints } from "./serverRequests.mjs";
import { displaySphere, displaymodifiedSphere } from "./displayInformation.mjs";
import { createPole } from "./pole.mjs";
import {saveAsJson} from "./saveData.mjs";
THREE.MapControls = MapControls;
THREE.OrbitControls = OrbitControls;

export class SceneBuilder {
  constructor() {
    this.points_count = 0;
    this.renderer = null;
    this.scene = null;
    this.clock = null;
    this.camera = null;
    this.raycaster = null;
    this.intersection = null;
    this.orbitcontrol = null;
    this.pcIndexed = null;
    this.spheresIndex = 0;
    this.splineObject = null;
    this.splineCurve = null;
    this.pointSize = 1;
    this.threshold = 0.5;
    //the threshold around a line that includes a point
    this.lineThreshold = 1;
    this.poleThreshold = 6;
    //the last catenary to be placed (still active for threshold adjustment)
    this.lastCatenary = null;
    this.toggle = 0;

    this.sphereGeometry = null;
    this.sphereMaterial = null;

    // this.tubeGeometry=null;
    // this.tubeMaterial=null;

    this.countNumber = 0;
    this.pointNumber = 3;

    this.previndex = null;

    this.index_1 = null;
    this.index_2 = null;
    this.index_3 = null;
    this.modifypoint = null;
    this.modifysphereMaterial = null;
    this.midify_flag = false;
    this.refer_index = null;

    //each catenary is an object that has three spheres, the vector, and the index of the points assocaited with the catanery.
    this.catenary = [];
    this.coordinatesDisplay = [];
    this.pointCloudIndex = [];
    //save timestamp when catenary created
    this.timestamp = [];
    this.data=[]
    //an array of catenary curves...
    this.vector = [];
    this.viewMode = 1;
    // the user selected nodes to create each catenary. This is the full list of all spheres.
    this.spheres = [];
    this.poles = [];
    this.poleCoordinates = [];
    this.index_array = [];

    this.vector_array = [];
    // consists of list of all catenary created
    this.splineObject_array = [];

    this.pointer = new THREE.Vector2();
    this.zMin = null;
    // document.addEventListener("click", this.selectPoint);
    document.onclick = this.onClick.bind(this);

    // document.addEventListener("dblclick", this.pointModifyReady);
    // document.ondblclick = this.pointModifyReady.bind(this);

    //document.addEventListener('pointermove', this.onPointerMove);
    document.onPointerMove = this.onPointerMove.bind(this);

    document.onkeydown = this.onkeydown.bind(this);

    document.onWindowResize = this.onWindowResize.bind(this);

    this.generateBasepoints = generateBasepoints.bind(this);
    this.paintCurve = paintCurve.bind(this);
    this.selectPoints = selectPoints.bind(this);
    this.createPole = createPole.bind(this);
    this.saveAsJson= saveAsJson.bind(this);
    this.init().catch(this.onInitialisationError);
  }

  onInitialisationError(error) {
    console.error(error);
  }

  async init() {
    const container = document.getElementById("container");

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      45, // FOV
      window.innerWidth / window.innerHeight, // aspect ratio
      1, // Camera frustum near plane
      10000 // Camera frustum far plane
    );
    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.camera.position.set(100, 100, 1000);
    this.camera.lookAt(this.scene.position);
    this.camera.updateMatrix();

    //generate a three points object

    try {
      let pts = await getPoints();
      this.points_count = pts.x.length;
      this.pcBuffer = generatePointcloud(pts.x, pts.y, pts.z, this.pointSize);
      // this.points_count = this.pcBuffer.children.length;
      console.log("points", this.points_count);
      this.zMin = Math.min.apply(Math, pts.z);
      console.log("z min", this.zMin);
      this.bbox = {
        xMin: Math.min.apply(Math, pts.x),
        yMin: Math.min.apply(Math, pts.y),
        xMax: Math.max.apply(Math, pts.x),
        yMax: Math.max.apply(Math, pts.y),
        zMin: Math.min.apply(Math, pts.z),
        zMax: Math.max.apply(Math, pts.z),
      };
    } catch (error) {
      console.error(error);
      return;
    }

    this.pcBuffer.scale.set(1, 1, 1);
    this.pcBuffer.position.set(0, 0, 0);
    this.scene.add(this.pcBuffer);

    //context point cloud (visible only - not clickable)
    this.pcIndexed = this.generateBasepoints();
    this.pcIndexed.scale.set(1, 1, 1);
    this.pcIndexed.position.set(0, 0, 0);
    this.scene.add(this.pcIndexed);

    //rendering
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(this.renderer.domElement);

    //

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = this.threshold;

    //

    this.orbitcontrol = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitcontrol.update();
    this.orbitcontrol.addEventListener("change", this.render.bind(this));
    //
    // document.addEventListener("dblclick", this.pointModifyReady.bind(this));

    this.sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.modifysphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });
    // console.log(this.scene);
    this.animate();

    // save data to json
    let saveLink = document.createElement("div");
    saveLink.style.position = "absolute";
    saveLink.style.top = "10px";
    saveLink.style.width = "100%";
    saveLink.style.color = "white !important";
    saveLink.style.textAlign = "center";
    saveLink.innerHTML = '<a href="#" id="saveLink">Save Frame</a>';
    document.body.appendChild(saveLink);
    document.getElementById("saveLink").addEventListener("click", this.saveAsJson);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  onkeydown(evt) {
    evt = evt || window.event;

    if (evt.keyCode === 38) {
      if (this.lastCatenary) {
        this.selectPoints(this.lastCatenary, (this.lineThreshold += 0.02));
        console.log(this.lineThreshold);
      }
    } else if (evt.keyCode === 40) {
      if (this.lastCatenary) {
        this.selectPoints(this.lastCatenary, (this.lineThreshold -= 0.02));
        console.log(this.lineThreshold);
      }
    } else if (evt.key >= "1" && evt.key < "5") {
      this.viewMode = evt.key;
      this.render();
    }
    // else if (evt.keyCode === 80){
    //   console.log('p pressed')
    // }
    else if (evt.keyCode === 27) {
      let children = this.scene.children;

      // for (let i = this.toggle + this.countNumber + 3; i > 2; i--) {
      //   this.scene.remove(this.scene.children[i]);
      // }
      for (let i = children.length; i > 1; i--) {
        this.scene.remove(this.scene.children[i]); // if we change  i > 1 to i>0 then the base plane will also be removed on pressing escape
      }

      for (let i = 0; i < this.points_count; i++) {
        const intensity = 1;
        const include = 1;
        const exclude = 0;

        this.pcBuffer.geometry.attributes.color.array[i * 3] =
          include * intensity;
        this.pcBuffer.geometry.attributes.color.array[i * 3 + 1] =
          exclude * intensity;
        this.pcBuffer.geometry.attributes.color.array[i * 3 + 2] =
          exclude * intensity;

        this.pcBuffer.geometry.attributes.color.needsUpdate = true;
      }
      this.vector = [];
      this.toggle = 0;
      this.countNumber = 0;
      this.spheres = [];
      this.poles = [];
      this.index_array = [];
      this.vector_array = [];
      this.splineObject_array = [];
      this.timestamp = [];
      this.pointCloudIndex = [];
    }
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  pointModifyReady() {
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersections = this.raycaster.intersectObjects(this.spheres, true);
    this.intersection = intersections.length > 0 ? intersections[0] : null;
    if (this.intersection == null) return;

    this.intersection.object.material = this.modifysphereMaterial;
    this.modifypoint = this.intersection;
    for (let i = 0; i < this.index_array.length; i++) {
      if (this.modifypoint.object.uuid === this.spheres[i].uuid) {
        this.refer_index = i;
      }
    }
    this.midify_flag = true;
  }

  async onClick(e) {
    e = e || window.event;
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (e.ctrlKey) {
      console.log("control key pressed");
      await this.findPoint(e);
      // create sphere for catenary
    } else if (e.altKey) {
      console.log(e);
      this.createPole(e);
      //create tube for pole
    } else if (e.shiftKey) {
      await this.pointModifyReady(e);
      // shift sphere to shift catenary
    } else {
      console.log("no key pressed");
      await this.modifyPoint(e);
      //move selected sphere to be shifted
    }
  }

  async findPoint(event) {
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

    let sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    sphere.position.set(
      this.intersection.point.x,
      this.intersection.point.y,
      this.intersection.point.z
    );
    this.scene.add(sphere);
    this.spheres.push(sphere);

    displaySphere(this.spheres);
    //get the index position of the selected point
    let { index } = this.intersection;

    //array of previously selected points
    this.index_array.push(index);

    //which point is being selected in terms of catenary order
    if (this.toggle === 1) this.previndex = index;
    this.toggle++;
    if (this.toggle % 3 === 0) this.index_3 = index;
    else if (this.toggle % 3 === 1) this.index_1 = index;
    else this.index_2 = index;

    //change the color of the selected point
    let colors = this.pcBuffer.geometry.attributes.color.array;

    colors[index * 3] = 1;
    colors[index * 3 + 1] = 1;
    colors[index * 3 + 2] = 1;

    this.pcBuffer.geometry.attributes.color.needsUpdate = true;

    let posix = this.intersection.point.x;
    let posiy = this.intersection.point.y;
    let posiz = this.intersection.point.z;
    // console.log(this.intersection.point);

    this.vector.push(new THREE.Vector3(posix, posiy, posiz));
    this.vector_array.push(new THREE.Vector3(posix, posiy, posiz));

    this.previndex = index;

    if (this.toggle % this.pointNumber === 0) {
      await this.paintCurve(this.vector[0], this.vector[1], this.vector[2]);
    }
  }

  async modifyPoint(event) {
    if (this.midify_flag === true) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersections = this.raycaster.intersectObject(this.pcBuffer, true);
      this.intersection = intersections.length > 0 ? intersections[0] : null;
      if (this.intersection == null) return;
      this.modifypoint.object.position.set(
        this.intersection.point.x,
        this.intersection.point.y,
        this.intersection.point.z
      );
      let pointDisplay = [];
      pointDisplay[0] = this.modifypoint;
      console.log(this.modifypoint);
      //display modified sphere to front end
      displaymodifiedSphere(this.modifypoint);
      this.modifypoint.object.material = this.sphereMaterial;
      this.vector_array[this.refer_index].set(
        this.intersection.point.x,
        this.intersection.point.y,
        this.intersection.point.z
      );

      let { index } = this.intersection;
      this.index_array[this.refer_index] = index;
      let count_curve = this.index_array.length / 3;
      count_curve = Math.floor(count_curve);
      for (let i = 0; i < this.splineObject_array.length; i++) {
        this.scene.remove(this.splineObject_array[i]);
      }

      this.countNumber -= this.spheres.length;

      this.splineObject_array = [];
      this.timestamp = [];
      this.pointCloudIndex = [];

      for (let i = 2; i < this.spheres.length; i += 3) {
        await this.paintCurve(
          this.vector_array[i - 2],
          this.vector_array[i - 1],
          this.vector_array[i]
        );
        console.log("number of spheres = " + this.spheres.length);
      }
      this.midify_flag = false;
    }
  }
  render() {
    this.camera.updateMatrixWorld();
    let _camera = this.camera;
    if (this.viewMode >= "2") {
      _camera = new THREE.OrthographicCamera(-200, 200, -100, 100, 1000, 10000);
      if (this.viewMode == "2") _camera.position.set(0, 0, 2000);
      if (this.viewMode == "3") _camera.position.set(2000, 0, 0);
      if (this.viewMode == "4") _camera.position.set(0, 2000, 0);
      _camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    this.renderer.render(this.scene, _camera);
  }

  onWindowResize() {
    this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
  }

}

  