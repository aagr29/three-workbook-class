import {generatePointcloud} from "./pointCloud.mjs"
import {generateBasepoints} from "./basePlane.mjs"
import {paintCurve, changeColor} from "./pointModifiers.mjs"

export class SceneBuilder {
    constructor() {
        this.renderer = null

        this.scene = null
        this.clock = null
        this.camera = null

        this.vector = [];

        this.raycaster = null
        this.intersection = null;
        this.spheresIndex = 0
        this.orbitcontrol = null
        this.pcIndexed = null
        this.splineObject = null
        this.splineCurve = null
        this.pointSize = 3
        this.threshold = 3.5

        this.toggle = 0

        this.sphere = null
        this.sphereGeometry = null
        this.sphereMaterial = null
        this.pcBuffer = null


        this.countNumber = 0;
        this.pointNumber = 3;

        this.previndex = null

        this.index_1 = null
        this.index_2 = null
        this.index_3 = null
        this.modifypoint = null
        this.modifysphereMaterial = null
        this.midify_flag = false;
        this.refer_index = null
        this.spheres = []

        this.index_array = [];
        this.vector_array = [];
        this.splineObject_array = [];

        this.pointer = new THREE.Vector2();


        this.pointclouds = []; // The object that represents the visible cloud of points. // Object of type THREE.Geometry containing the visible points.


        // document.addEventListener("click", this.selectPoint);
        document.onclick = this.onClick.bind(this)

        // document.addEventListener("dblclick", this.pointModifyReady);
        document.ondblclick = this.pointModifyReady.bind(this)

        //document.addEventListener('pointermove', this.onPointerMove);
        document.onPointerMove = this.onPointerMove.bind(this)

        document.onkeydown = this.onkeydown.bind(this)

        document.onWindowResize = this.onWindowResize.bind(this)

        this.init();
        this.animate();

    }

    init() {
        const container = document.getElementById("container");

        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        this.camera.up = new THREE.Vector3( 0, 0, 1 );
        this.camera.position.set(100, 100, 1000);
   
        this.camera.lookAt(this.scene.position);
        this.camera.updateMatrix();
    
        this.pcBuffer = generatePointcloud(this.pointSize);

        console.log("pcBuffer", this.pcBuffer)

        this.pcBuffer.scale.set(5, 10, 10);
        this.pcBuffer.position.set(0, 0, 0);
        this.scene.add(this.pcBuffer);
  

        
        this.pcIndexed = generateBasepoints(this.pointSize)
        this.pcIndexed.scale.set(5, 10, 10);
        this.pcIndexed.position.set(-50, -50, zp_min);
        this.scene.add(this.pcIndexed);
        this.pointclouds = [this.pcBuffer];

        console.log(this.pointclouds);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        //

        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Points.threshold = this.threshold;

        //

        this.orbitcontrol = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitcontrol.update();
        this.orbitcontrol.addEventListener("change", this.render.bind(this));
        //

        this.sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.modifysphereMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});

        // for ( let i = 0; i < 40; i ++ ) {

        // 	const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        // 	scene.add( sphere );
        // 	spheres.push( sphere );

        // }
        // sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // scene.add(sphere);

    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    onkeydown(evt){

        evt = evt || window.event;
        if (evt.keyCode === 27) {
            for (let i = this.toggle + this.countNumber + 3; i > 2; i--) {
                this.scene.remove(this.scene.children[i]);
            }
            // let colors_pcBuffer, colors_pcIndexed, colors_pcIndexedOffset;
            // colors_pcBuffer = pcBuffer.geometry.attributes.color.array;
            let index = 0;
            for (let i = 0; i < xp.length; i++) {


                const intensity = 1
                const include = 1
                const exclude = 0

                this.pcBuffer.geometry.attributes.color.array[index * 3] = include * intensity;
                this.pcBuffer.geometry.attributes.color.array[index * 3 + 1] = exclude * intensity;
                this.pcBuffer.geometry.attributes.color.array[index * 3 + 2] = exclude * intensity;


                this.pcBuffer.geometry.attributes.color.needsUpdate = true;

                index++;

            }
            this.vector = [];
            this.toggle = 0;
            this.countNumber = 0;
            this.spheres = [];
            this.index_array = [];
            this.vector_array = [];
            this.splineObject_array = [];
        }
    }


    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    pointModifyReady() {

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.spheres, true);
        this.intersection = (intersections.length) > 0 ? intersections[0] : null;
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
        //if(e.ctrlKey && toggle!=pointNumber){
        //if(e.ctrlKey ){
        console.log(e)
        if (e.ctrlKey) {
            await this.findPoint(e)
        } else if (this.modifypoint && this.midify_flag === true) {
            await this.modifyPoint(e)
        }

    }

    async findPoint(e){


        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.pointclouds, true);
        this.intersection = (intersections.length) > 0 ? intersections[0] : null;
        if (this.intersection == null) {
            console.log("no point found")
            return
        }

        this.toggle++;
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.set(this.intersection.point.x, this.intersection.point.y, this.intersection.point.z);
        this.scene.add(this.sphere);
        this.spheres.push(this.sphere);


        let {index} = this.intersection
        let first = index * 3;
        let object = this.pcBuffer;
        if (this.toggle === 1) this.previndex = index;

        this.index_array.push(index);
        if (this.toggle % 3 === 0) this.index_3 = index;
        else if (this.toggle % 3 === 1) this.index_1 = index;
        else this.index_2 = index;
        // if(toggle>1)changeColor(previndex, index);

        let colors = object.geometry.attributes.color.array;

        colors[first] = 255
        colors[first + 1] = 255
        colors[first + 2] = 255

        object.geometry.attributes.color.array = colors
        object.geometry.attributes.color.needsUpdate = true;
        const position = object.geometry.attributes.position.array;

        let posix = this.intersection.point.x;
        let posiy = this.intersection.point.y;
        let posiz = this.intersection.point.z;

        this.vector.push(new THREE.Vector3(posix, posiy, posiz));
        this.vector_array.push(new THREE.Vector3(posix, posiy, posiz));
        // if(toggle==pointNumber){
        // 	paintCurve();
        // }

        this.previndex = index;
        if (this.toggle % this.pointNumber === 0) {
            paintCurve(this, this.vector[0], this.vector[1], this.vector[2]);
            changeColor(this.index_1, this.index_2);
            changeColor(this.index_2, this.index_3);
        }
    }


    async modifyPoint(e){

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.pointclouds, true);
        this.intersection = (intersections.length) > 0 ? intersections[0] : null;
        if (this.intersection == null) return;
        this.modifypoint.object.position.set(this.intersection.point.x, this.intersection.point.y, this.intersection.point.z);
        this.modifypoint.object.material = this.sphereMaterial;
        this.vector_array[this.refer_index].set(this.intersection.point.x, this.intersection.point.y, this.intersection.point.z);
        let add_index = 0;

        //todo make xp a class attribute
        for (let i = 0; i < xp.length; i++) {

            const intensity = 1
            const include = 1
            const exclude = 0

            this.pcBuffer.geometry.attributes.color.array[add_index * 3] = include * intensity;
            this.pcBuffer.geometry.attributes.color.array[add_index * 3 + 1] = exclude * intensity;
            this.pcBuffer.geometry.attributes.color.array[add_index * 3 + 2] = exclude * intensity;
            this.pcBuffer.geometry.attributes.color.needsUpdate = true;
            add_index++;

        }

        let {index} = this.intersection;
        // if (intersection.object.uuid == pcIndexed.uuid) index = index + 12800;
        // if (intersection.object.uuid == pcIndexedOffset.uuid) index = index + 12800 * 2;
        this.index_array[this.refer_index] = index;
        let count_curve = this.index_array.length / 3;
        count_curve = Math.floor(count_curve);

        for (let i = 0; i < 3 * count_curve; i++) {
            if (i % 3 === 2) continue;
            changeColor(this.index_array[i], this.index_array[i + 1]);
        }


        for (let i = 0; i < this.splineObject_array.length; i++) {
            this.scene.remove(this.splineObject_array[i]);
        }

        this.countNumber -= this.spheres.length;

        this.splineObject_array = [];
        for (let i = 2; i < this.spheres.length; i += 3) {
            await paintCurve(this, this.vector_array[i - 2], this.vector_array[i - 1], this.vector_array[i]);
            console.log("asdjfklsadfsafsadfsdaf" + this.spheres.length)
        }
        this.midify_flag = false;
    }

    render() {
        this.camera.updateMatrixWorld();
        this.renderer.render(this.scene, this.camera);
    }


    onWindowResize() {
        this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    }

}






