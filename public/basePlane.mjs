//create base plane
export function generateBasepoints(pointSize) {
    const points = [];
    const color = []
    for (let i = 0; i < (length1 / 2); i++) {
        for (let j = 0; j < (length1 / 2); j++) {
            const x = i
            const y = j
            const z = zp_min
            const r = 0;
            const b = 0
            const g = 1
            points.push(x, y, z);
            color.push(r, b, g)
        }
    }
    for (let i = 0; i < (length1 / 2); i++) {
        for (let j = -(length1 / 2); j < 0; j++) {
            const x = i
            const y = j
            const z = zp_min
            const r = 0;
            const b = 0
            const g = 1
            points.push(x, y, z);
            color.push(r, b, g)
        }
    }
    for (let i = -(length1 / 2); i < 0; i++) {
        for (let j = -(length1 / 2); j < 0; j++) {
            const x = i
            const y = j
            const z = zp_min
            const r = 0
            const b = 0
            const g = 1
            points.push(x, y, z);
            color.push(r, b, g)
        }
    }
    for (let i = -(length1 / 2); i < 0; i++) {
        for (let j = 0; j < (length1 / 2); j++) {
            const x = i
            const y = j
            const z = zp_min
            const r = 0
            const b = 0
            const g = 1
            points.push(x, y, z);
            color.push(r, b, g)
        }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position", new THREE.BufferAttribute(new Float32Array(points), 3)
    );
    geometry.setAttribute(
        "color", new THREE.BufferAttribute(new Float32Array(color), 3)
    );
    const material = new THREE.PointsMaterial({
        size: pointSize, vertexColors: true
    });

    return new THREE.Points(geometry, material);

}