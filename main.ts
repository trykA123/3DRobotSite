import * as THREE from "three";
import { CameraHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import soldierModel from "./models/Soldier.glb?url";
import ambientTexture from "./textures/ambient.jpg";
import displacementTexture from "./textures/displacement.jpg";
import nrm2 from "./textures/nrm2.jpg";
import textureColor from "./textures/rock2.jpg";
import { CharacterControls } from "./utils/controls";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// random box

const box = new THREE.BoxGeometry(1, 1, 1);
// const boxmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create a canvas and draw text
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 256;
ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "16px Arial";
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
  "01000001 00100000 01101110 01100101 01110111 00100000 01110000 01100001 01110100 01101000";

wrapText(
  ctx,
  longText,
  canvas.width / 2,
  canvas.height / 1.5,
  canvas.width - 20,
  20
);

// Create a texture from the canvas
const texture = new THREE.CanvasTexture(canvas);

// Use the texture as the map for the cube material
const boxmaterial = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(box, boxmaterial);

cube.position.x = 5;

scene.add(cube);

// Load the planet texture
const planetTexture = new THREE.TextureLoader().load("../textures/moon.jpg");

// Create a sphere geometry
const planetRadius = 5;
const planetGeometry = new THREE.SphereGeometry(planetRadius, 32, 32);

// Create a material using the texture map
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });

// Create a mesh using the geometry and the material
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

// Position the planet at a suitable location in your scene
planet.position.set(-1000, 100, -100);

// Add the planet mesh to the scene
scene.add(planet);

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 3;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

// LIGHTS
light();

// FLOOR
generateFloor();
generateStars();

// FBX model

// const loader = new FBXLoader();

// loader.load(
//   "/models/Running.fbx",
//   (fbx) => {
//     fbx.scale.set(1, 1, 1);
//     fbx.position.set(0, 0, 0);
//     fbx.rotation.set(0, 0, 0);

//     scene.add(fbx);
//   },
//   undefined,
//   (error) => {
//     console.error("An error occurred while loading the FBX model:", error);
//   }
// );

// MODEL WITH ANIMATIONS
// var characterControls: CharacterControls;
// new FBXLoader().load(
//   "models/Running.fbx",
//   function (object) {
//     const model = object;
//     model.traverse(function (object) {
//       if (object.isMesh) object.castShadow = true;
//     });
//     scene.add(model);

//     const fbxAnimations = object.animations;

//     console.log("Available animations:");
//     fbxAnimations.forEach((a) => {
//       console.log(a.name);
//     });
//     const mixer = new THREE.AnimationMixer(model);
//     const animationsMap = new Map();
//     fbxAnimations
//       .filter((a) => a.name != "Running")
//       .forEach((a) => {
//         animationsMap.set(a.name, mixer.clipAction(a));
//       });

//     characterControls = new CharacterControls(
//       model,
//       mixer,
//       animationsMap,
//       orbitControls,
//       camera,
//       "Idle"
//     );
//   },
//   undefined,
//   (error) => {
//     console.error("An error occurred while loading the FBX model:", error);
//   }
// );

//MODEL WITH ANIMATIONS GLB
var characterControls: CharacterControls;
new GLTFLoader().load(soldierModel, function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  scene.add(model);

  const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
  const mixer = new THREE.AnimationMixer(model);
  const animationsMap: Map<string, THREE.AnimationAction> = new Map();
  gltfAnimations
    .filter((a) => a.name != "TPose")
    .forEach((a: THREE.AnimationClip) => {
      animationsMap.set(a.name, mixer.clipAction(a));
    });

  characterControls = new CharacterControls(
    model,
    mixer,
    animationsMap,
    orbitControls,
    camera,
    "Idle"
  );
});

const keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      (keysPressed as any)[event.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    (keysPressed as any)[event.key.toLowerCase()] = false;
  },
  false
);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControls) {
    characterControls.update(mixerUpdateDelta, keysPressed);
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

function generateFloor() {
  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const sandBaseColor = textureLoader.load(textureColor);
  const sandNormalMap = textureLoader.load(nrm2);
  const sandHeightMap = textureLoader.load(displacementTexture);
  const sandAmbientOcclusion = textureLoader.load(ambientTexture);

  const WIDTH = 300;
  const LENGTH = 300;

  const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new THREE.MeshStandardMaterial({
    map: sandBaseColor,
    normalMap: sandNormalMap,
    displacementMap: sandHeightMap,
    displacementScale: 0.1,
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
  map.repeat.x = map.repeat.y = 10;
}

function light() {
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
  // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}

function generateStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.7,
  });

  const starVertices = [];
  const starCount = 5000;

  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
