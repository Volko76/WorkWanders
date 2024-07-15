import * as THREE from 'three';
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";
import { FirstPersonControls } from "https://threejs.org/examples/jsm/controls/FirstPersonControls.js";

document.addEventListener('DOMContentLoaded', function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    // Load FBX model
    const loader = new FBXLoader();
    let doomModel;
    loader.load('/models/doom.fbx', function (fbx) {
        const s = 0.01;
        fbx.scale.set(s, s, s);
        fbx.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                const originalMaterials = child.material;
                if (Array.isArray(originalMaterials)) {
                    for (let i = 0; i < originalMaterials.length; i++) {
                        const originalMaterial = originalMaterials[i];
                        const newMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffffff // set color to white
                        });
                        if (originalMaterial.map) {
                            newMaterial.map = originalMaterial.map; // keep the original texture
                        }
                        originalMaterials[i] = newMaterial;
                    }
                } else {
                    const originalMaterial = originalMaterials;
                    const newMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff // set color to white
                    });
                    if (originalMaterial.map) {
                        newMaterial.map = originalMaterial.map; // keep the original texture
                    }
                    child.material = newMaterial;
                }
            }
        });
        doomModel = fbx;
        scene.add(fbx);
    }, undefined, function (error) {
        console.error(error);
    });

    // FirstPersonControls
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.lookSpeed = 0.1;
    controls.movementSpeed = 1;
    controls.noFly = true;
    controls.lookVertical = true;

    // Movement and physics
    camera.position.set(0, 1.6, 5);

    // Score system
    let score = 0;
    const scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '24px';
    scoreElement.innerHTML = `Score: ${score}`;
    document.body.appendChild(scoreElement);

    // Basic collision detection
    function checkCollision() {
        if (!doomModel) return false;
        const playerBox = new THREE.Box3().setFromObject(camera);
        let collision = false;
        doomModel.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                const wallBox = new THREE.Box3().setFromObject(child);
                if (playerBox.intersectsBox(wallBox)) {
                    collision = true;
                }
            }
        });
        return collision;
    }

    // Handle player movement and collisions
    function handleMovement(delta) {
        const initialPosition = camera.position.clone();
        controls.update(delta);
        if (checkCollision()) {
            camera.position.copy(initialPosition); // revert to the initial position if there's a collision
        }
    }

    // Animation loop
    const clock = new THREE.Clock();
    const animate = function () {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        handleMovement(delta);

        // Update score (for example, increment over time)
        score += 1;
        scoreElement.innerHTML = `Score: ${score}`;

        renderer.render(scene, camera);
    };

    animate();
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
