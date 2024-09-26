export default function binarySearch(sortedRoute, targetLon) {
  let low = 0;
  let high = sortedRoute.length - 1;

  // Check for edge cases where the target is outside the route bounds
  if (targetLon <= sortedRoute[low][1]) {
    return sortedRoute[low];
  } else if (targetLon >= sortedRoute[high][1]) {
    return sortedRoute[high];
  }

  // Binary search to find the closest two points by longitude
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (sortedRoute[mid][1] === targetLon) {
      // If an exact match by longitude is found, return the closest latitude point
      return sortedRoute[mid];
    } else if (sortedRoute[mid][1] < targetLon) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return [low, high];
}