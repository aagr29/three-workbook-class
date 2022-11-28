import {getCatenaryPoints} from"./serverRequests.mjs"

export function paintCurve(sceneBuilder, vector1, vector2, vector3) {

    let x1 = vector1.x
    let y1 = vector1.y
    let z1 = vector1.z
    let x2 = vector2.x
    let y2 = vector2.y
    let z2 = vector2.z
    let x3 = vector3.x
    let y3 = vector3.y
    let z3 = vector3.z

    let payload;
    payload = {
        "name": "Adrian",
        "point1": [x1, y1, z1],
        "point2": [x2, y2, z2],
        "point3": [x3, y3, z3],
        "end1": [x1, y1],
        "end2": [x3, y3]
    }
    console.log(payload)
    let a =  getCatenaryPoints(payload)
    colorPointsOnCurve(sceneBuilder, a)


    // setTimeout(secondcode, 1500, a)


}


function colorPointsOnCurve(sceneBuilder, a) {

    let data1 = []
    let coordinates = []
    a.then((value) => {
        console.log('api',value)
        data1 = value
     

        for (let i = 0; i < data1.length; i++) {
            coordinates.push(new THREE.Vector3(data1[i][0], data1[i][1], data1[i][2]));
        }

   
       

        sceneBuilder.splineCurve = new THREE.CatmullRomCurve3([coordinates[0], coordinates[1], coordinates[2], coordinates[3], coordinates[4], coordinates[5], coordinates[6], coordinates[7], coordinates[8], coordinates[9], coordinates[10]]);

        const points = sceneBuilder.splineCurve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({color: 0xAAFF00});
        sceneBuilder.splineObject = new THREE.Line(geometry, material);
        sceneBuilder.scene.add(sceneBuilder.splineObject);
        sceneBuilder.splineObject_array.push(sceneBuilder.splineObject);

    });

    sceneBuilder.countNumber++;
    sceneBuilder.vector = [];

}


export function changeColor(pindex = Number, cindex = Number) {
    let x_pindex = pindex / length;
    let y_pindex = pindex % length;
    let x_cindex = cindex / length;
    let y_cindex = cindex % length;


    x_pindex = Math.floor(x_pindex);
    x_cindex = Math.floor(x_cindex);

    let flag = true;
    if (Math.abs(x_pindex - x_cindex) < Math.abs(y_pindex - y_cindex)) flag = false;
    if (flag) {
        let aspect = (y_cindex - y_pindex) / (x_cindex - x_pindex);
        if (x_cindex >= x_pindex) {
            for (let i = 1; i < (x_cindex - x_pindex); i++) {
                let y_index = i * aspect;
                y_index = Math.round(y_index) + y_pindex;
                let index = (x_pindex + i) * length + y_index;
                let object = pcBuffer;

                if (index / points_count >= 1) object = pcIndexed;
                if (index / points_count >= 2) object = pcIndexedOffset;

                index = index % points_count;
                object.geometry.attributes.color
                let colors = object.geometry.attributes.color.array;

                colors[index * 3] = 255
                colors[index * 3 + 1] = 255
                colors[index * 3 + 2] = 255

                object.geometry.attributes.color.array = colors
                object.geometry.attributes.color.needsUpdate = true;
                const position = object.geometry.attributes.position.array;
            }
        } else {
            for (let i = 1; i < (x_pindex - x_cindex); i++) {
                let y_index = i * aspect;
                y_index = Math.round(y_index) + y_cindex;
                let index = (x_cindex + i) * length + y_index;
                let object = pcBuffer;

                if (index / points_count >= 1) object = pcIndexed;
                if (index / points_count >= 2) object = pcIndexedOffset;

                index = index % points_count;
                object.geometry.attributes.color
                let colors = object.geometry.attributes.color.array;

                colors[index * 3] = 255
                colors[index * 3 + 1] = 255
                colors[index * 3 + 2] = 255

                object.geometry.attributes.color.array = colors
                object.geometry.attributes.color.needsUpdate = true;
                const position = object.geometry.attributes.position.array;
            }
        }
    } else {
        let aspect = (y_cindex - y_pindex) / (x_cindex - x_pindex);
        if (y_cindex >= y_pindex) {
            for (let i = 1; i < (y_cindex - y_pindex); i++) {
                let x_index = i / aspect;
                x_index = Math.round(x_index) + x_pindex;
                let index = (x_index) * length + y_pindex + i;
                let object = pcBuffer;

                if (index / points_count >= 1) object = pcIndexed;
                if (index / points_count >= 2) object = pcIndexedOffset;

                index = index % points_count;
                object.geometry.attributes.color
                let colors = object.geometry.attributes.color.array;

                colors[index * 3] = 255
                colors[index * 3 + 1] = 255
                colors[index * 3 + 2] = 255

                object.geometry.attributes.color.array = colors
                object.geometry.attributes.color.needsUpdate = true;
                const position = object.geometry.attributes.position.array;
            }
        } else {
            for (let i = 1; i < (y_pindex - y_cindex); i++) {
                let x_index = i / aspect;
                x_index = Math.round(x_index) + x_cindex;
                let index = (x_index) * length + y_cindex + i;
                let object = pcBuffer;

                if (index / points_count >= 1) object = pcIndexed;
                if (index / points_count >= 2) object = pcIndexedOffset;

                index = index % points_count;
                object.geometry.attributes.color
                let colors = object.geometry.attributes.color.array;

                colors[index * 3] = 255
                colors[index * 3 + 1] = 255
                colors[index * 3 + 2] = 255

                object.geometry.attributes.color.array = colors
                object.geometry.attributes.color.needsUpdate = true;
                const position = object.geometry.attributes.position.array;
            }
        }
    }
}
