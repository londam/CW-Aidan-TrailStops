import { RoutePoint } from "../types/route";

export type KDTreeNode = {
  point: RoutePoint;
  left: KDTreeNode | null;
  right: KDTreeNode | null;
};

export function buildKDTree(points: RoutePoint[], depth: number = 0): KDTreeNode | null {
  if (points.length === 0) {
    return null;
  }

  // Alternate between x and y axis
  const axis = depth % 2;

  // Sort points by the current axis (0 for x, 1 for y)
  points.sort((a, b) => (axis === 0 ? a.lat - b.lat : a.lng - b.lng));

  // Find the median point
  const medianIndex = Math.floor(points.length / 2);
  const medianPoint = points[medianIndex];

  // Recursively build left and right subtrees
  return {
    point: medianPoint,
    left: buildKDTree(points.slice(0, medianIndex), depth + 1),
    right: buildKDTree(points.slice(medianIndex + 1), depth + 1),
  };
}

function distanceSquared(point1: RoutePoint, point2: RoutePoint): number {
  const dx = point1.lat - point2.lat;
  const dy = point1.lng - point2.lng;
  return dx * dx + dy * dy; // No need for square root, just comparing squared distances
}

export function nearestNeighbor(
  node: KDTreeNode | null,
  target: RoutePoint,
  depth: number = 0,
  best: KDTreeNode | null = null
): KDTreeNode | null {
  if (node === null) {
    return best;
  }

  // Update the best point if the current node is closer to the target
  const axis = depth % 2;
  let newBest = best;
  if (best === null || distanceSquared(node.point, target) < distanceSquared(best.point, target)) {
    newBest = node;
  }

  // Check the splitting plane: compare target's value along the current axis with the node's value
  const direction = axis === 0 ? target.lat - node.point.lat : target.lng - node.point.lng;

  // Recursively search the side of the tree where the target is likely to be
  const nextBranch = direction < 0 ? node.left : node.right;
  const otherBranch = direction < 0 ? node.right : node.left;

  newBest = nearestNeighbor(nextBranch, target, depth + 1, newBest);

  // Backtrack to the other branch if necessary (if the potential closest point could be on the other side)
  if (direction * direction < distanceSquared(newBest.point, target)) {
    newBest = nearestNeighbor(otherBranch, target, depth + 1, newBest);
  }

  return newBest;
}
