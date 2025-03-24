// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot (Realistic Humanoid Design)
const robotGroup = new THREE.Group();

// Head (Slightly Angular)
const headGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1, 32);
const headMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.9 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(15, 2, 5); // Moved to right side
robotGroup.add(head);

// Eye (Single Glowing Lens)
const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0 });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(15.3, 2, 5.5); // Right-facing eye
robotGroup.add(eye);

// Torso (Tapered and Sleek)
const torsoGeometry = new THREE.CylinderGeometry(0.8, 1, 2.5, 32);
const torsoMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.7 });
const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
torso.position.set(15, 0.5, 5);
robotGroup.add(torso);

// Arms (Simple but Realistic)
const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
const armMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.7 });
const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.set(14.5, 1.5, 5);
leftArm.rotation.z = Math.PI / 4;
const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.set(15.5, 1.5, 5);
rightArm.rotation.z = -Math.PI / 4;
robotGroup.add(leftArm, rightArm);

scene.add(robotGroup);

// V-Shaped Vision Cone (Pointing Left)
const coneGeometry = new THREE.ConeGeometry(10, 20, 32, 1, true); // Open-ended cone
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
const visionCone = new THREE.Mesh(coneGeometry, coneMaterial);
visionCone.position.set(15.3, 2, 5.5); // Aligned with eye
visionCone.rotation.z = Math.PI / 2; // Pointing left
scene.add(visionCone);

// Sci-Fi Drones (Approaching from Right)
const droneGeometry = new THREE.TetrahedronGeometry(0.8, 2);
const droneMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.5 });
const drones = [];
let totalDetectionCount = 0; // Persistent count
for (let i = 0; i < 8; i++) {
    const drone = new THREE.Mesh(droneGeometry, droneMaterial.clone());
    drone.position.set(
        20 + Math.random() * 15, // Start from the right
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    drone.userData = { detected: false, speed: 0.03 + Math.random() * 0.02 };
    scene.add(drone);
    drones.push(drone);

    // Detection Label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Orbitron';
    ctx.fillStyle = '#00d4e0';
    ctx.fillText('DRONE DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    drone.add(sprite);

    // Glowing Outline
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0, wireframe: true });
    const outline = new THREE.Mesh(droneGeometry, outlineMaterial);
    outline.scale.set(1.1, 1.1, 1.1);
    drone.add(outline);
}

// Detection Count Display (Above Robot)
const countCanvas = document.createElement('canvas');
countCanvas.width = 256;
countCanvas.height = 64;
const countCtx = countCanvas.getContext('2d');
countCtx.font = '20px Orbitron';
countCtx.fillStyle = '#00d4e0';
const countTexture = new THREE.CanvasTexture(countCanvas);
const countSpriteMaterial = new THREE.SpriteMaterial({ map: countTexture, transparent: true });
const countSprite = new THREE.Sprite(countSpriteMaterial);
countSprite.scale.set(4, 1, 1);
countSprite.position.set(15, 4, 5);
scene.add(countSprite);

// Subtle Particle Background
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 50;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 40;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0x5a4eff, size: 0.1, transparent: true, opacity: 0.3 });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

camera.position.z = 20;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Stable Robot (Subtle Head Movement)
    head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;

    // Drone Movement and Detection
    let currentDetections = 0;
    drones.forEach(drone => {
        drone.position.x -= drone.userData.speed; // Approach from right
        drone.rotation.x += 0.01;
        drone.rotation.y += 0.01;
        if (drone.position.x < -20) {
            drone.position.x = 20 + Math.random() * 15; // Reset to right
            drone.material.opacity = 0.5;
            drone.children[0].material.opacity = 0;
            drone.children[1].material.opacity = 0;
        }

        // Check if drone is within vision cone (pointing left)
        const relativePos = new THREE.Vector3().subVectors(drone.position, visionCone.position);
        const coneDirection = new THREE.Vector3(-1, 0, 0); // Cone points left
        const angle = relativePos.angleTo(coneDirection);
        const distance = relativePos.length();
        if (angle < Math.PI / 6 && distance < 20) { // 30-degree cone
            if (!drone.userData.detected) {
                drone.userData.detected = true;
                totalDetectionCount++; // Increment persistent count
            }
            drone.material.opacity = 0.8;
            drone.children[0].material.opacity = 0.8; // Label
            drone.children[1].material.opacity = 0.8; // Outline
            currentDetections++;
        } else {
            drone.userData.detected = false;
            drone.material.opacity = 0.5;
            drone.children[0].material.opacity = 0;
            drone.children[1].material.opacity = 0;
        }
    });

    // Update Detection Count
    countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
    countCtx.fillStyle = document.body.classList.contains('dark') ? '#00d4e0' : '#00a4b0';
    countCtx.fillText(`TOTAL DRONES DETECTED: ${totalDetectionCount}`, 10, 40);
    countTexture.needsUpdate = true;

    // Particle Animation
    const particlePositions = particles.geometry.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
        particlePositions[i] += Math.sin(Date.now() * 0.001 + particlePositions[i - 1]) * 0.005;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
animate();

// Mouse Interaction
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    camera.position.x = mouseX * 5;
    camera.position.y = mouseY * 3;
    camera.lookAt(scene.position);
});

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navbar shrink on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
});

// Dark/Light Mode Toggle
const toggleButton = document.getElementById('themeToggle');
const docBody = document.body;
const currentTheme = localStorage.getItem('theme') || 'dark';
docBody.classList.add(currentTheme);

toggleButton.addEventListener('click', () => {
    if (docBody.classList.contains('dark')) {
        docBody.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        docBody.classList.replace('light', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Show live demo in modal
function showDemo(demoId) {
    const demoFrame = document.getElementById('demoFrame');
    const demoUrls = {
        'demo1': 'https://your-demo-url-1.com', // Replace with your live demo URLs
        'demo2': 'https://your-demo-url-2.com',
        'demo3': 'https://your-demo-url-3.com'
    };
    demoFrame.src = demoUrls[demoId];
    const modal = new bootstrap.Modal(document.getElementById('demoModal'));
    modal.show();
}

// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('#projects .project-card, #about, #contact').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});