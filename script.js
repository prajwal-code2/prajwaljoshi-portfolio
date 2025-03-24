// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot Eye
const eyeGroup = new THREE.Group();
const eyeGeometry = new THREE.SphereGeometry(1, 32, 32);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x6b48ff, wireframe: true });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(0, 5, 10);
eyeGroup.add(eye);

// Iris (Glowing Center)
const irisGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x00ddeb });
const iris = new THREE.Mesh(irisGeometry, irisMaterial);
iris.position.set(0, 0, 0.8);
eye.add(iris);

// Scanning Beam
const beamGeometry = new THREE.PlaneGeometry(20, 0.2);
const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00ddeb, transparent: true, opacity: 0.5 });
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(0, 0, 0);
eyeGroup.add(beam);
scene.add(eyeGroup);

// Tracked Objects (Bounding Boxes)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff4e50, wireframe: true });
const boxes = [];
for (let i = 0; i < 5; i++) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial.clone());
    box.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5,
        (Math.random() - 0.5) * 10
    );
    box.userData = { detected: false, glow: 0 };
    scene.add(box);
    boxes.push(box);
}

// Tracking Lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ddeb, transparent: true, opacity: 0.7 });
const trackingLines = [];

camera.position.z = 20;

// Animation Loop
let beamAngle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Eye Movement
    eyeGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
    eyeGroup.rotation.x = Math.cos(Date.now() * 0.001) * 0.1;

    // Beam Scanning
    beamAngle += 0.05;
    beam.position.y = Math.sin(beamAngle) * 10 - 5;

    // Box Animation and Detection
    boxes.forEach(box => {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        box.position.x += Math.sin(Date.now() * 0.001 + box.position.z) * 0.02;

        // Detection Check
        const distance = Math.abs(box.position.y - beam.position.y);
        if (distance < 1 && !box.userData.detected) {
            box.userData.detected = true;
            box.material.color.setHex(0x00ddeb); // Highlight when detected
            box.userData.glow = 1;

            // Add Tracking Line
            const geometry = new THREE.BufferGeometry().setFromPoints([
                eye.position,
                box.position
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            trackingLines.push(line);
        }

        // Glow Fade
        if (box.userData.glow > 0) {
            box.userData.glow -= 0.02;
            box.material.opacity = 0.5 + box.userData.glow * 0.5;
            if (box.userData.glow <= 0) {
                box.userData.detected = false;
                box.material.color.setHex(0xff4e50);
                box.material.opacity = 1;
            }
        }
    });

    // Update Tracking Lines
    trackingLines.forEach((line, index) => {
        const box = boxes[Math.floor(index / boxes.length * boxes.length)];
        line.geometry.setFromPoints([eye.position, box.position]);
    });

    renderer.render(scene, camera);
}
animate();

// Mouse Interaction
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    eyeGroup.rotation.y += mouseX * 0.005;
    eyeGroup.rotation.x += mouseY * 0.005;
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
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('#projects .project-card, #about, #contact').forEach(el => {
    observer.observe(el);
});