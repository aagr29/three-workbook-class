export function dataObject(
  variable1,
  variable2,
  variable3,
  variable4,
  variable5,
  variable6,
  variable7
) {
  variable1 = [];

  for (let i = 0; i < variable2.length; i++) {
    let item = {
      id: i + 1,
      conductorId: variable2[i].uuid,
      sphere: [variable3[3 * i], variable3[3 * i + 1], variable3[3 * i + 2]],
      conductorPosition: [
        variable4[i][0],
        variable4[i][1],
        variable4[i][2],
        variable4[i][3],
        variable4[i][4],
        variable4[i][5],
        variable4[i][6],
        variable4[i][7],
        variable4[i][8],
        variable4[i][9],
        variable4[i][10],
      ],
      pointCloud: variable6[i],
      timestamp: [variable5[i]],
      polesId: [variable7[2 * i].uuid, variable7[2 * i + 1].uuid],
      poles: [variable7[2 * i].geometry.parameters.path.points, variable7[2 * i + 1].geometry.parameters.path.points]
    };
    variable1.push(item);
  }
  console.log("Objects created", variable1);
  return variable1
}
