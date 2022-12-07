//create base plane
export function generateBasepoints() {
  const points = [];
  const color = [];
  let z = this.bbox.zMin;

  let step = 2;
  let xMin = Math.floor(this.bbox.xMin);
  let xMax = Math.ceil(this.bbox.xMax);
  let yMin = Math.floor(this.bbox.yMin);
  let yMax = Math.ceil(this.bbox.yMax);

  for (let x = xMin; x < xMax; x += step) {
    for (let y = yMin; y < yMax; y += step) {
      points.push(x, y, z);
      color.push(0.6, 0.3, 0);
    }
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
  const material = new THREE.PointsMaterial({
    size: this.pointSize,
    vertexColors: true,
  });

  return new THREE.Points(geometry, material);
}
