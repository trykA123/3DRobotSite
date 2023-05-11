import * as THREE from "three";
import gambaColor from "../textures/gamba.webp";
import moonColor from "../textures/moon.webp";
import neptuneColor from "../textures/neptune.webp";
import sunColor from "../textures/sun.webp";

export function createMoon(scene: THREE.Scene) {
  // Load the planet texture
  const moonTexture = new THREE.TextureLoader().load(moonColor);

  // Create a sphere geometry
  const moonRadius = 5;
  const moonGeometry = new THREE.SphereGeometry(moonRadius, 64, 64);

  // Create a material using the texture map
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

  // Create a mesh using the geometry and the material
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);

  // Position the planet at a suitable location in your scene
  moon.position.set(-800, 300, -2200);

  // Add the planet mesh to the scene
  scene.add(moon);
}

export function createGambaCentauri(scene: THREE.Scene) {
  const gambaTexture = new THREE.TextureLoader().load(gambaColor);

  // Create a sphere geometry
  const gambaRadius = 30;
  const gambaGeometry = new THREE.SphereGeometry(gambaRadius, 64, 64);

  // Create a material using the texture map
  const gambaMaterial = new THREE.MeshStandardMaterial({ map: gambaTexture });

  // Create a mesh using the geometry and the material
  const gamba = new THREE.Mesh(gambaGeometry, gambaMaterial);

  // Position the planet at a suitable location in your scene
  gamba.position.set(-700, 350, -2200);

  // Add the planet mesh to the scene
  scene.add(gamba);
}

export function createSun(scene: THREE.Scene) {
  const sunTexture = new THREE.TextureLoader().load(sunColor);

  // Create a sphere geometry
  const sunRadius = 180;
  const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);

  // Create a material using the texture map
  const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });

  // Create a mesh using the geometry and the material
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);

  // Position the planet at a suitable location in your scene
  sun.position.set(-2200, 800, 1800);

  // Add the planet mesh to the scene
  scene.add(sun);
}

export function createNeptune(scene: THREE.Scene) {
  const neptuneTexture = new THREE.TextureLoader().load(neptuneColor);

  // Create a sphere geometry
  const neptuneRadius = 30;
  const neptuneGeometry = new THREE.SphereGeometry(neptuneRadius, 64, 64);

  // Create a material using the texture map
  const neptuneMaterial = new THREE.MeshStandardMaterial({
    map: neptuneTexture,
  });

  // Create a mesh using the geometry and the material
  const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

  // Set the initial position relative to the character's position
  const characterPosition = new THREE.Vector3(0, 5, 10);
  const offset = new THREE.Vector3(2200, 400, -700); // Adjust the offset as needed
  neptune.position.copy(characterPosition).add(offset);

  // Add the planet mesh to the scene
  scene.add(neptune);
}
