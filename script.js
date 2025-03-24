// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera (Left Side)
const camGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
const camMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.8 });
const cam = new THREE.Mesh(camGeometry, camMaterial);
cam.position.set(-15, 0, 5);
cam.rotation.z = Math.PI / 2;
scene.add(cam);

// Scanning Beam
const beamGeometry = new THREE.PlaneGeometry(0.2, 20);
const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.5 });
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(-15, 0, 5);
scene.add(beam);

// Detected Objects
const objGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const objMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.5 });
const objects = [];
let detectionCount = 0;
for (let i = 0; i < 8; i++) {
    const obj = new THREE.Mesh(objGeometry, objMaterial.clone());
    obj.position.set(
        (Math.random() - 0.5) * 20 + 5,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
    );
    obj.userData = { isFalse: Math.random() > 0.7, detected: false };
    scene.add(obj);
    objects.push(obj);

    // Warning Label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Orbitron';
    ctx.fillStyle = obj.userData.isFalse ? '#ff4e50' : '#00d4e0';
    ctx.fillText(obj.userData.isFalse ? 'WARNING' : 'DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    obj.add(sprite);
}

camera.position.z = 20;

// Animation Loop
let beamAngle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Beam Scanning
    beamAngle += 0.02;
    beam.position.x = -15 + Math.cos(beamAngle) * 5;
    beam.rotation.y = Math.sin(beamAngle) * 0.5;

    // Object Animation and Detection
    detectionCount = 0;
    objects.forEach(obj => {
        obj.rotation.x += 0.003;
        obj.rotation.y += 0.003;
        obj.position.x += Math.sin(Date.now() * 0.001 + obj.position.z) * 0.01;

        const distance = Math.abs(obj.position.x - beam.position.x);
        if (distance < 1 && !obj.userData.detected) {
            obj.userData.detected = true;
            obj.material.opacity = 0.8;
            obj.children[0].material.opacity = 0.8;
            detectionCount++;
            setTimeout(() => {
                obj.userData.detected = false;
                obj.material.opacity = 0.5;
                obj.children[0].material.opacity = 0;
            }, 2000);
        }
    });

    // Update Detection Count
    document.getElementById('detectionCount').textContent = `Objects Detected: ${detectionCount}`;

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
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'dark';
body.classList.add(currentTheme);

toggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
        body.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light', 'dark');
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