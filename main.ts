import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import robotModel from "./models/spacerobot1.glb?url";
import { CharacterControls } from "./utils/controls";
import { bModel, roboModel } from "./utils/models";
import {
  createGambaCentauri,
  createMoon,
  createNeptune,
  createSun,
} from "./utils/planets";
import { codedPlate, generateFloor, generateStars, light } from "./utils/utils";

const manager = new THREE.LoadingManager(() => {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.add("fade-out");
  // optional: remove loader from DOM via event listener
  loadingScreen.addEventListener("transitionend", onTransitionEnd);
});

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

codedPlate(scene);
createGambaCentauri(scene);
createMoon(scene);
createNeptune(scene);
createSun(scene);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  5000
);
camera.position.y = 5;
camera.position.z = 10;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 3;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.01;
orbitControls.update();

// LIGHTS
light(scene);

// FLOOR
generateFloor(scene);
generateStars(scene);

//MODEL WITH ANIMATIONS GLB
var characterControls: CharacterControls;
new GLTFLoader(manager).load(robotModel, function (gltf) {
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

function onTransitionEnd(event) {
  event.target.remove();
}

// RESIZE HANDLER
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
