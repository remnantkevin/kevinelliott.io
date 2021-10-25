function getCenter(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

function getDistanceTo(coord1, coord2) {
  return { x: coord2.x - coord1.x, y: coord2.y - coord1.y };
}

function getViewportCenter() {
  return {
    x: document.documentElement.clientWidth / 2,
    y: document.documentElement.clientHeight / 2,
  };
}
