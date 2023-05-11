import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import baseModel from "../models/modular_stack.glb?url";
import robotModel from "../models/spacerobot1.glb?url";
import { CharacterControls } from "./controls";

// Load base

export function bModel(scene: THREE.Scene) {
  const baseLoader = new GLTFLoader();
  baseLoader.load(baseModel, (gltf) => {
    const model = gltf.scene;

    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(20, 2, 20);

    scene.add(model);
  });
}

export function roboModel(scene: THREE.Scene) {
  //MODEL WITH ANIMATIONS GLB
  var characterControls: CharacterControls;
  new GLTFLoader().load(robotModel, function (gltf) {
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
}
