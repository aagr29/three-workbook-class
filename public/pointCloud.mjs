export function generatePointcloud(xp, yp, zp, pointSize) {
  const geometry = generatePointCloudGeometry(xp, yp, zp);

  const material = new THREE.PointsMaterial({
    size: pointSize,
    vertexColors: true,
  });
  // this.points_count=xp.length
  return new THREE.Points(geometry, material);
}

function generatePointCloudGeometry(xp, yp, zp) {
  const points = [];
  const color = [];
  for (let i = 0; i < xp.length; i++) {
    const x = parseFloat(xp[i]).toFixed(7);
    const y = parseFloat(yp[i]).toFixed(7);
    const z = parseFloat(zp[i]).toFixed(7);

    const r = 1;
    const b = 0;
    const g = 0;

    points.push(x, y, z);
    color.push(r, b, g);
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(points), 3)
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(color), 3)
  );

  return geometry;
}
