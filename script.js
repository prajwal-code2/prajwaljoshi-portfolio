// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot (Simplified Humanoid)
const robotGroup = new THREE.Group();

// Head
const headGeometry = new THREE.BoxGeometry(1, 1, 1);
const headMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.8 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(-15, 2, 5);
robotGroup.add(head);

// Eyes (Beam Source)
const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0 });
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-15.3, 2.2, 5.4);
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(-14.7, 2.2, 5.4);
robotGroup.add(leftEye, rightEye);

// Body
const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.6 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.set(-15, 0.5, 5);
robotGroup.add(body);

scene.add(robotGroup);

// Scanning Beam from Eyes
const beamGeometry = new THREE.PlaneGeometry(20, 0.2);
const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.5 });
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(-15, 2.2, 5); // Starts at eye level
scene.add(beam);

// Ships (Approaching Objects)
const shipGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
const shipMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.5 });
const ships = [];
let detectionCount = 0;
for (let i = 0; i < 6; i++) {
    const ship = new THREE.Mesh(shipGeometry, shipMaterial.clone());
    ship.position.set(
        20 + Math.random() * 10, // Start from the right
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
    );
    ship.rotation.x = Math.PI / 2;
    ship.userData = { detected: false, speed: 0.02 + Math.random() * 0.03 };
    scene.add(ship);
    ships.push(ship);

    // Detection Label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Orbitron';
    ctx.fillStyle = '#00d4e0';
    ctx.fillText('SHIP DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    ship.add(sprite);
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
countSprite.position.set(-15, 4, 5);
scene.add(countSprite);

camera.position.z = 20;

// Animation Loop
let beamAngle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Beam Scanning from Eyes
    beamAngle += 0.03;
    beam.position.x = -15 + Math.cos(beamAngle) * 10;
    beam.rotation.y = Math.sin(beamAngle) * 0.3;

    // Ship Movement and Detection
    detectionCount = 0;
    ships.forEach(ship => {
        ship.position.x -= ship.userData.speed; // Approach from right
        if (ship.position.x < -20) {
            ship.position.x = 20 + Math.random() * 10; // Reset to right
            ship.userData.detected = false;
            ship.material.opacity = 0.5;
            ship.children[0].material.opacity = 0;
        }

        const distance = Math.abs(ship.position.x - beam.position.x);
        if (distance < 1 && !ship.userData.detected) {
            ship.userData.detected = true;
            ship.material.opacity = 0.8;
            ship.children[0].material.opacity = 0.8;
            detectionCount++;
            setTimeout(() => {
                if (ship.userData.detected) {
                    ship.userData.detected = false;
                    ship.material.opacity = 0.5;
                    ship.children[0].material.opacity = 0;
                }
            }, 2000);
        }
    });

    // Update Detection Count
    countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
    countCtx.fillStyle = document.body.classList.contains('dark') ? '#00d4e0' : '#00a4b0';
    countCtx.fillText(`SHIPS DETECTED: ${detectionCount}`, 10, 40);
    countTexture.needsUpdate = true;

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