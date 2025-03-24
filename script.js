// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Holographic Scanning Plane
const planeGeometry = new THREE.PlaneGeometry(30, 0.2);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.4 });
const scanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
scanPlane.position.set(0, 0, -5);
scene.add(scanPlane);

// Detected Objects (Cubes)
const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.3 });
const cubes = [];
for (let i = 0; i < 6; i++) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
    cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    cube.userData = { detected: false };
    scene.add(cube);
    cubes.push(cube);

    // Detection Label (Text Sprite)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '20px Orbitron';
    ctx.fillStyle = '#00d4e0';
    ctx.fillText('DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    cube.add(sprite);
}

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
const particleMaterial = new THREE.PointsMaterial({ color: 0x5a4eff, size: 0.1, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

camera.position.z = 15;

// Animation Loop
let scanAngle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Scanning Plane Animation
    scanAngle += 0.02;
    scanPlane.position.y = Math.sin(scanAngle) * 8;

    // Cube Animation and Detection
    cubes.forEach(cube => {
        cube.rotation.x += 0.003;
        cube.rotation.y += 0.003;
        cube.position.z += Math.sin(Date.now() * 0.001 + cube.position.x) * 0.01;

        const distance = Math.abs(cube.position.y - scanPlane.position.y);
        if (distance < 0.5) {
            cube.material.opacity = 0.8;
            cube.children[0].material.opacity = 0.8; // Show "DETECTED" label
        } else {
            cube.material.opacity = 0.3;
            cube.children[0].material.opacity = 0; // Hide label
        }
    });

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
    const demoFrame = document.getElementById('demoFrame'); // Fixed ID reference
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