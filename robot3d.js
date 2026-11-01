
import * as THREE from "three";

const container = document.getElementById("robot3d");

if (container) {
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
camera.position.set(0, 0.1, 9);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xc8f5ff, 0x10152e, 2));

    const keyLight = new THREE.PointLight(0x42eaff, 45);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x795bff, 35);
    rimLight.position.set(-4, 1, -2);
    scene.add(rimLight);

    const robot = new THREE.Group();
    scene.add(robot);
    robot.scale.setScalar(0.62);

    const whiteMetal = new THREE.MeshStandardMaterial({
        color: 0xdde8f0,
        metalness: 0.8,
        roughness: 0.24
    });

    const darkMetal = new THREE.MeshStandardMaterial({
        color: 0x202c3b,
        metalness: 0.85,
        roughness: 0.3
    });

    const cyan = new THREE.MeshStandardMaterial({
        color: 0x27eaff,
        emissive: 0x00aacc,
        emissiveIntensity: 2.5,
        metalness: 0.3,
        roughness: 0.2
    });

    function sphere(parent, material, position, scale) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 24),
            material
        );
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        parent.add(mesh);
        return mesh;
    }

    function box(parent, material, position, size, radius = 0.12) {
        const geometry = new THREE.BoxGeometry(...size);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.scale.set(1, 1, 1);
        parent.add(mesh);
        return mesh;
    }

    function cylinder(parent, material, position, radiusTop, radiusBottom, height) {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                radiusTop,
                radiusBottom,
                height,
                32
            ),
            material
        );
        mesh.position.set(...position);
        parent.add(mesh);
        return mesh;
    }

    // Neck and torso
    cylinder(robot, darkMetal, [0, 0.75, 0], 0.22, 0.25, 0.35);

    sphere(robot, whiteMetal, [0, 0.05, 0], [0.82, 0.95, 0.48]);

    sphere(robot, darkMetal, [0, 0.35, 0.39], [0.52, 0.48, 0.15]);

    sphere(robot, cyan, [0, 0.35, 0.53], [0.18, 0.18, 0.07]);

    // Head
    const head = new THREE.Group();
    head.position.set(0, 1.65, 0);
    robot.add(head);

    sphere(head, whiteMetal, [0, 0, 0], [0.68, 0.57, 0.52]);

    sphere(head, darkMetal, [0, -0.02, 0.43], [0.52, 0.32, 0.16]);

    // Glowing eyes
    sphere(head, cyan, [-0.23, 0.02, 0.57], [0.11, 0.065, 0.045]);
    sphere(head, cyan, [0.23, 0.02, 0.57], [0.11, 0.065, 0.045]);

    // Mouth light
    box(head, cyan, [0, -0.19, 0.58], [0.22, 0.035, 0.025]);

    // Antenna
    cylinder(head, darkMetal, [0, 0.64, 0], 0.035, 0.045, 0.22);
    sphere(head, cyan, [0, 0.78, 0], [0.09, 0.09, 0.09]);

    // Shoulders, arms and hands
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.78, 0.48, 0);
    robot.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.78, 0.48, 0);
    robot.add(rightArm);

    function makeArm(arm) {
        sphere(arm, darkMetal, [0, 0, 0], [0.19, 0.2, 0.2]);
        cylinder(arm, whiteMetal, [0, -0.35, 0], 0.15, 0.18, 0.5);
        sphere(arm, darkMetal, [0, -0.62, 0], [0.14, 0.14, 0.14]);
        cylinder(arm, whiteMetal, [0, -0.88, 0], 0.11, 0.13, 0.42);
        sphere(arm, darkMetal, [0, -1.13, 0], [0.16, 0.15, 0.14]);
    }

    makeArm(leftArm);
    makeArm(rightArm);

    // Waist and legs
    sphere(robot, darkMetal, [0, -0.82, 0], [0.52, 0.28, 0.36]);

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.3, -1, 0);
    robot.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.3, -1, 0);
    robot.add(rightLeg);

    function makeLeg(leg) {
        cylinder(leg, whiteMetal, [0, -0.38, 0], 0.19, 0.23, 0.65);
        sphere(leg, darkMetal, [0, -0.76, 0], [0.18, 0.18, 0.19]);
        cylinder(leg, whiteMetal, [0, -1.02, 0], 0.15, 0.17, 0.45);
        sphere(leg, darkMetal, [0, -1.27, 0.12], [0.25, 0.13, 0.38]);
    }

    makeLeg(leftLeg);
    makeLeg(rightLeg);

    // Soft glowing floor ring
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.25, 0.025, 12, 80),
        cyan
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.05;
    ring.scale.set(1, 0.6, 1);
    scene.add(ring);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        robot.position.y = 0.1 + Math.sin(t * 1.5) * 0.03;
        robot.rotation.y = Math.sin(t * 0.45) * 0.12;
        head.rotation.y = Math.sin(t * 0.8) * 0.08;
        leftArm.rotation.z = Math.sin(t * 1.2) * 0.04;
        rightArm.rotation.z = Math.sin(t * 1.2) * 0.04;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
