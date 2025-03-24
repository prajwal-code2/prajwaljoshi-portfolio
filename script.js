// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot Eye
const eyeGroup = new THREE.Group();
const eyeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, wireframe: true });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(0, 8, 10);
eyeGroup.add(eye);

// Iris (Subtle Glow)
const irisGeometry = new THREE.SphereGeometry(0.4, 16, 16);
const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x00c4cc });
const iris = new THREE.Mesh(irisGeometry, irisMaterial);
iris.position.set(0, 0, 1);
eye.add(iris);

// Scanning Beam (Minimalist)
const beamGeometry = new THREE.PlaneGeometry(30, 0.1);
const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00c4cc, transparent: true, opacity: 0.3 });
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(0, 0, 0);
eyeGroup.add(beam);
scene.add(eyeGroup);

// Tracked Objects (Subtle Boxes)
const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x7a4eff, wireframe: true, transparent: true, opacity: 0.5 });
const boxes = [];
for (let i = 0; i < 4; i++) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial.clone());
    box.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5,
        (Math.random() - 0.5) * 10
    );
    scene.add(box);
    boxes.push(box);
}

camera.position.z = 20;

// Animation Loop
let beamAngle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Eye Movement (Subtle)
    eyeGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
    eyeGroup.rotation.x = Math.cos(Date.now() * 0.0005) * 0.05;

    // Beam Scanning (Smooth and Minimal)
    beamAngle += 0.02;
    beam.position.y = Math.sin(beamAngle) * 8 - 5;

    // Box Animation (Elegant Movement)
    boxes.forEach(box => {
        box.rotation.x += 0.005;
        box.rotation.y += 0.005;
        box.position.y += Math.sin(Date.now() * 0.001 + box.position.x) * 0.01;

        // Subtle Detection Highlight
        const distance = Math.abs(box.position.y - beam.position.y);
        if (distance < 0.5) {
            box.material.opacity = 0.8;
        } else {
            box.material.opacity = 0.5;
        }
    });

    renderer.render(scene, camera);
}
animate();

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
    const demoFrame = document.getElementById('threeCanvas');
    const demoUrls = {
        'demo1': 'https://your-demo-url-1.com', // Replace with your live demo URLs
        'demo2': 'https://your-demo-url-2.com',
        'demo3': 'https://your-demo-url-3.com'
    };
    demoFrame.src = demoUrls[demoId];
    const modal = new bootstrap.Modal(document.getElementById('demoModal'));
    modal.show();
}

// Scroll-triggered animations (removed animate.css for simplicity)
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