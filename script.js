// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot Head (Realistic Design)
const robotGroup = new THREE.Group();

// Head (Metallic Base)
const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1);
const headMaterial = new THREE.MeshPhongMaterial({ color: 0x3a3a5a, shininess: 100, specular: 0x555555 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(-15, 2, 5);
robotGroup.add(head);

// Eye (Glowing Lens)
const eyeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.9 });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(-14.8, 2, 5.5);
robotGroup.add(eye);

// Add Ambient and Point Light for Realism
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-15, 5, 10);
scene.add(pointLight);

// V-Shaped Vision Cone
const coneGeometry = new THREE.ConeGeometry(10, 20, 32, 1, true);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
const visionCone = new THREE.Mesh(coneGeometry, coneMaterial);
visionCone.position.set(-14.8, 2, 5.5); // Aligned with eye
visionCone.rotation.z = -Math.PI / 2; // Horizontal orientation
robotGroup.add(visionCone);

scene.add(robotGroup);

// Ships (Sci-Fi Design)
const shipGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8);
const shipMaterial = new THREE.MeshPhongMaterial({ color: 0x5a4eff, shininess: 50, specular: 0x333333 });
const ships = [];
let detectionCount = 0;
for (let i = 0; i < 6; i++) {
    const ship = new THREE.Mesh(shipGeometry, shipMaterial.clone());
    ship.position.set(
        20 + Math.random() * 10, // Start from right
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    ship.rotation.x = Math.PI / 2;
    ship.userData = { detected: false, speed: 0.03 + Math.random() * 0.02, isUnidentified: Math.random() > 0.8 };
    scene.add(ship);
    ships.push(ship);

    // Detection Label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Orbitron';
    ctx.fillStyle = ship.userData.isUnidentified ? '#ff4e50' : '#00d4e0';
    ctx.fillText(ship.userData.isUnidentified ? 'UNIDENTIFIED' : 'SHIP DETECTED', 10, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1, 0);
    ship.add(sprite);
}

// Detection Count HUD (Above Robot)
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
countSprite.position.set(-15, 4.5, 5);
scene.add(countSprite);

camera.position.z = 20;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Stable Robot (No wobble)
    robotGroup.position.set(-15, 2, 5);

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

        // V-Cone Detection
        const distance = Math.sqrt(
            Math.pow(ship.position.x - visionCone.position.x, 2) +
            Math.pow(ship.position.y - visionCone.position.y, 2)
        );
        const inCone = distance < 10 && ship.position.x > visionCone.position.x;
        if (inCone && !ship.userData.detected) {
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
    countCtx.fillText(`DETECTIONS: ${detectionCount}`, 10, 40);
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