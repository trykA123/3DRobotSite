import * as THREE from "three";
import ambientTexture from "../textures/ambient.webp";
import displacementTexture from "../textures/displacement.webp";
import nrm2 from "../textures/nrm2.webp";
import textureColor from "../textures/rock2.webp";

const W = "w";
const A = "a";
const S = "s";
const D = "d";
const SHIFT = "shift";
const DIRECTIONS = [W, A, S, D];
export { A, D, DIRECTIONS, S, SHIFT, W };

export function generateFloor(scene: THREE.Scene) {
  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const venusColor = new THREE.Color(0xa57c1b);
  const sandBaseColor = textureLoader.load(textureColor);
  const sandNormalMap = textureLoader.load(nrm2);
  const sandHeightMap = textureLoader.load(displacementTexture);
  const sandAmbientOcclusion = textureLoader.load(ambientTexture);

  const WIDTH = 1500;
  const LENGTH = 1500;

  const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new THREE.MeshStandardMaterial({
    map: sandBaseColor,
    normalMap: sandNormalMap,
    displacementMap: sandHeightMap,
    displacementScale: 0.05,
    aoMap: sandAmbientOcclusion,
  });
  wrapAndRepeatTexture(material.map);
  wrapAndRepeatTexture(material.normalMap);
  wrapAndRepeatTexture(material.displacementMap);
  wrapAndRepeatTexture(material.aoMap);

  const floor = new THREE.Mesh(geometry, material);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
}

function wrapAndRepeatTexture(map: THREE.Texture) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.x = map.repeat.y = 30;
}

export function generateStars(scene: THREE.Scene) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    transparent: true,
    opacity: 0.7,
  });

  const starVertices = [];
  const starCount = 10000;

  const floorSize = 1500; // Size of your floor

  // Define the range outside the floor
  const range = floorSize * 5.5;

  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloat(-range, range);
    const y = Math.random() * (4000 - 200) + 200;
    const z = THREE.MathUtils.randFloat(-range, range);

    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

export function codedPlate(scene: THREE.Scene) {
  const box = new THREE.BoxGeometry(1, 1, 1);

  // Create a canvas and draw text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 256;
  ctx.fillStyle = "rgba(20, 47, 74, 0.06)";
  //ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  //  159, 165, 171
  // Wrap text function
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  const longText =
    "01000001 00100000 01101110 01100101 01110111 00100000 01110000 01100001 01110100 01101000";

  wrapText(
    ctx,
    longText,
    canvas.width / 2,
    canvas.height / 3,
    canvas.width - 20,
    20
  );

  // Create a texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Use the texture as the map for the cube material
  const boxmaterial = new THREE.MeshBasicMaterial({ map: texture });
  const cube = new THREE.Mesh(box, boxmaterial);

  cube.position.set(200, -0.25, 100);
  // correct one cube.position.set(200, -0.45, 100);

  scene.add(cube);
}
