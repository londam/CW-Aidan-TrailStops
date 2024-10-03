async function getNearAccommodations(lat: number, lng: number) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    const response: Response = await fetch(
      `http://localhost:3001/getAccommodation?lat=${lat}&lon=${lng}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching accommodations:", error);
  }
}
async function extractAccommodations(lat: number, lng: number) {
  const data = await getNearAccommodations(lat, lng);
  const { results } = data;
  if (results.length <= 0) {
    return null;
  }
  let outputArr = [];
  for (let i = 0; i < results.length; i++) {
    if (!results[i].photos) {
      // TODO: fix photos
      continue;
    }
    const url = await fetchAccommodationPicture(results[i].photos[0].photo_reference);
    const { name, vicinity } = results[i];
    outputArr[i] = { name, url, vicinity };
  }
  return outputArr;
}
async function fetchAccommodationPicture(photoReference: string) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await fetch(
    `http://localhost:3001/accommodationPic?photo_reference=${photoReference}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Image not found");
  }
  return await response.json();
}
const APIService = { extractAccommodations };
export default APIService;
