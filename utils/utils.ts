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
    const y = Math.random() * (4000 - 150) + 150;
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

export function codedPlate(scene) {
  const box = new THREE.BoxGeometry(1, 1, 1);

  // Create a canvas and draw text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 512;
  ctx.fillStyle = "rgba(20, 47, 74, 0.06)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

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
    "Even I had to spend like 10 minutes to find it.. and I did this stuff";

  wrapText(
    ctx,
    longText,
    canvas.width / 2,
    canvas.height / 3,
    canvas.width - 40,
    40
  );

  // Create a texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Use the texture as the map for the cube material
  const boxMaterial = new THREE.MeshPhongMaterial({ map: texture }); // or MeshStandardMaterial
  const cube = new THREE.Mesh(box, boxMaterial);

  cube.position.set(100, -0.25, 50);

  // Make the text cube selectable
  cube.userData.selectable = true;

  // Add the text cube to the scene
  scene.add(cube);

  // Add an event listener for the mouse click event
  document.addEventListener("mousedown", onMouseDown, false);

  // Mouse down event handler
  function onMouseDown(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
      console.log("Text cube selected!");
      // Perform your desired action here
    }
  }
}

export function light(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 100, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
}
