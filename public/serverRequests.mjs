export async function getCatenaryPoints(payload) {
  const response = await fetch(
    "https://feature-detection.virtual-tas-pipeline.real-time.community/api/worker/catenary/construct?key=AIzaSyBhmSYn1IaOu88QgC2kZ7ae0g0325czLyU&usr=test&pwd=test",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data_res = await response.json();
  return data_res.catPoints;
}

export async function getPoints() {
  const response = await fetch("/get_coordinates");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data_res = await response.json();

  return data_res;
}
