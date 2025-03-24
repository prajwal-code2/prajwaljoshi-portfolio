// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot (Detailed Sci-Fi Design on Right Side)
const robotGroup = new THREE.Group();

// Head (Metallic Cube)
const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const headMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.9 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(15, 2, 5); // Right side
robotGroup.add(head);

// Eye (Single Glowing Orb, Facing Left)
const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0 });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(15.3, 2, 5.5); // Positioned to face left
robotGroup.add(eye);

// Body (Tapered, Futuristic)
const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 2.5, 32);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.7 });
const robotBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
robotBody.position.set(15, 0.5, 5);
robotGroup.add(robotBody);

scene.add(robotGroup);

// V-Shaped Vision Cone (Facing Left)
const coneGeometry = new THREE.ConeGeometry(10, 20, 32, 1, true); // Open-ended cone
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
const visionCone = new THREE.Mesh(coneGeometry, coneMaterial);
visionCone.position.set(15.3, 2, 5.5); // Aligned with eye
visionCone.rotation.z = Math.PI / 2; // Pointing left
scene.add(visionCone);

// Objects (Boxes and Circles Approaching from Left)
const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const circleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const objMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.5 });
const objects = [];
let totalDetectionCount = 0; // Persistent count until reload
for (let i = 0; i < 10; i++) {
    const isBox = Math.random() > 0.5;
    const obj = new THREE.Mesh(isBox ? boxGeometry : circleGeometry, objMaterial.clone());
    obj.position.set(
        -20 - Math.random() * 15, // Start from the left
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    obj.userData = { detected: false, speed: 0.03 + Math.random() * 0.02 };
    scene.add(obj);
    objects.push(obj);

    // Detection Label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Orbitron';
    ctx.fillStyle = '#00d4e0';
    ctx.fillText(isBox ? 'BOX DETECTED' : 'CIRCLE DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    obj.add(sprite);

    // Glowing Outline
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0, wireframe: true });
    const outline = new THREE.Mesh(isBox ? boxGeometry : circleGeometry, outlineMaterial);
    outline.scale.set(1.1, 1.1, 1.1);
    obj.add(outline);
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

    // Stable Robot (Slight Head Tilt)
    head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;

    // Object Movement and Detection
    objects.forEach(obj => {
        obj.position.x += obj.userData.speed; // Approach from left
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        if (obj.position.x > 20) {
            obj.position.x = -20 - Math.random() * 15; // Reset to left
            obj.material.opacity = 0.5;
            obj.children[0].material.opacity = 0;
            obj.children[1].material.opacity = 0;
        }

        // Check if object is within vision cone
        const relativePos = new THREE.Vector3().subVectors(obj.position, visionCone.position);
        const coneDirection = new THREE.Vector3(-1, 0, 0); // Cone points left
        const angle = relativePos.angleTo(coneDirection);
        const distance = relativePos.length();
        if (angle < Math.PI / 6 && distance < 20 && !obj.userData.detected) { // 30-degree cone
            obj.userData.detected = true;
            obj.material.opacity = 0.8;
            obj.children[0].material.opacity = 0.8; // Label
            obj.children[1].material.opacity = 0.8; // Outline
            totalDetectionCount++; // Increment total count persistently
        }
    });

    // Update Detection Count
    countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
    countCtx.fillStyle = document.body.classList.contains('dark') ? '#00d4e0' : '#00a4b0';
    countCtx.fillText(`OBJECTS DETECTED: ${totalDetectionCount}`, 10, 40);
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