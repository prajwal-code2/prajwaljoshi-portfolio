// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Robot (Simple Sci-Fi Design)
const robotGroup = new THREE.Group();

// Head
const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const headMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.9 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(-15, 2, 5);
robotGroup.add(head);

// Eye (Vision Source)
const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4e0 });
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye.position.set(-14.7, 2, 5.5);
robotGroup.add(eye);

// Body
const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 2.5, 32);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x3a3a6a, transparent: true, opacity: 0.7 });
const robotBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
robotBody.position.set(-15, 0.5, 5);
robotGroup.add(robotBody);

scene.add(robotGroup);

// V-Shaped Scanner (Stable Apex, Perspective Shift via Tilt)
const vShapeGeometry = new THREE.BufferGeometry();
const vAngle = Math.PI / 12; // Base 15° half-angle (30° total)
const vLength = 25; // Length of V arms
const vertices = new Float32Array([
    0, 0, 0, // Apex
    vLength * Math.cos(vAngle), vLength * Math.sin(vAngle), 0, // Top arm
    vLength * Math.cos(-vAngle), vLength * Math.sin(-vAngle), 0 // Bottom arm
]);
vShapeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
vShapeGeometry.setIndex([0, 1, 2]);
const vShapeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
const scannerField = new THREE.Mesh(vShapeGeometry, vShapeMaterial);
scannerField.position.set(-14.7, 2, 5.5); // Apex fixed at eye
scene.add(scannerField);

// Debug Marker (to confirm apex position)
const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
marker.position.set(-14.7, 2, 5.5); // Matches eye
scene.add(marker);

// Enhanced Ships (Horizontal, Pointing Right)
const shipGeometry = new THREE.ConeGeometry(0.3, 1.5, 8); // Tapered, sleek shape
const shipMaterial = new THREE.MeshBasicMaterial({ color: 0x5a4eff, transparent: true, opacity: 0.7 });
const ships = [];
let totalDetections = 0; // Persistent count
for (let i = 0; i < 8; i++) {
    const ship = new THREE.Mesh(shipGeometry, shipMaterial.clone());
    ship.rotation.z = Math.PI / 2; // Point right (tip at positive x)
    ship.position.set(
        20 + Math.random() * 5, // Extreme right (x: 20 to 25)
        2 + (Math.random() - 0.5) * 10, // Wider y-range
        5.5 + (Math.random() - 0.5) * 10 // Wider z-range
    );
    ship.userData = { detected: false, speed: 0.05 + Math.random() * 0.03, detectionTime: null };
    scene.add(ship);
    ships.push(ship);

    // Glowing Effect (Point Light)
    const glow = new THREE.PointLight(0x5a4eff, 0.5, 5);
    glow.position.set(0, 0, 0);
    ship.add(glow);
}

// Detection Count Display
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

// Typewriter Effect (HTML-Based, Aligned with "P")
const typewriterContainer = document.getElementById('typewriter-container');
const typewriterCanvas = document.createElement('canvas');
typewriterCanvas.width = 768;
typewriterCanvas.height = 80; // Bigger
const typewriterCtx = typewriterCanvas.getContext('2d');
typewriterCtx.font = '28px Orbitron'; // Larger font
typewriterCtx.fillStyle = '#00d4e0';
const titleText = "Computer Vision Specialist";
const taglineText = "Transforming Pixels into Actionable Insights";
let currentText = titleText;
let currentIndex = 0;
let isErasing = false;
const typeSpeed = 100;
const delayBetween = 1000; // 1s delay between cycles

function typeWriter() {
    typewriterCtx.clearRect(0, 0, typewriterCanvas.width, typewriterCanvas.height);
    typewriterCtx.fillStyle = document.body.classList.contains('dark') ? '#00d4e0' : '#00a4b0';
    const textWidth = typewriterCtx.measureText("Prajwal Joshi").width;
    const offsetX = (typewriterCanvas.width - textWidth) / 2; // Center align with h1
    typewriterCtx.fillText(currentText.slice(0, currentIndex), offsetX, 50);
    const currentTextWidth = typewriterCtx.measureText(currentText.slice(0, currentIndex)).width;
    typewriterCtx.fillRect(offsetX + currentTextWidth, 25, 2, 30);

    if (!isErasing && currentIndex < currentText.length) {
        currentIndex++;
        setTimeout(typeWriter, typeSpeed);
    } else if (!isErasing && currentIndex === currentText.length) {
        setTimeout(() => { isErasing = true; typeWriter(); }, delayBetween);
    } else if (isErasing && currentIndex > 0) {
        currentIndex--;
        setTimeout(typeWriter, typeSpeed / 2);
    } else if (isErasing && currentIndex === 0) {
        isErasing = false;
        currentText = currentText === titleText ? taglineText : titleText;
        setTimeout(typeWriter, delayBetween);
    }

    typewriterContainer.innerHTML = '';
    typewriterContainer.appendChild(typewriterCanvas);
}

typeWriter();

camera.position.z = 20;

// Animation Loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);

    // Perspective Shift for Scanner (Tilt Adjustment)
    time += 0.05;
    const dynamicTilt = Math.sin(time) * Math.PI / 6; // ±30° tilt range
    scannerField.rotation.y = dynamicTilt; // Adjust tilt for perspective

    // Ship Movement and Detection
    ships.forEach((ship, index) => {
        // Always move ships
        ship.position.x -= ship.userData.speed;
        if (ship.position.x < -20 && !ship.userData.detected) {
            ship.position.x = 20 + Math.random() * 5;
            ship.position.y = 2 + (Math.random() - 0.5) * 10;
            ship.position.z = 5.5 + (Math.random() - 0.5) * 10;
            ship.material.opacity = 0.7;
        }

        // Check for detection
        if (!ship.userData.detected) {
            const relativePos = new THREE.Vector3().subVectors(ship.position, scannerField.position);
            const vDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(scannerField.quaternion);
            const angle = relativePos.angleTo(vDirection);
            const distance = relativePos.length();
            if (angle < vAngle && distance <= vLength) {
                console.log('DETECTED:', { x: ship.position.x, y: ship.position.y, z: ship.position.z });
                ship.userData.detected = true;
                ship.userData.detectionTime = Date.now();
                totalDetections++;

                // Sci-Fi Bounding Box
                const boxGroup = new THREE.Group();
                const boxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
                const boxGeometry = new THREE.BoxGeometry(2, 1, 1); // Slightly larger than ship
                const edges = new THREE.EdgesGeometry(boxGeometry);
                const boundingBox = new THREE.LineSegments(edges, boxMaterial);
                boundingBox.position.copy(ship.position);
                boxGroup.add(boundingBox);

                // Add Corner Accents (Sci-Fi Glow)
                const cornerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const cornerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.9 });
                const corners = [
                    [1, 0.5, 0.5], [-1, 0.5, 0.5], [1, -0.5, 0.5], [-1, -0.5, 0.5],
                    [1, 0.5, -0.5], [-1, 0.5, -0.5], [1, -0.5, -0.5], [-1, -0.5, -0.5]
                ];
                corners.forEach(pos => {
                    const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
                    corner.position.set(pos[0], pos[1], pos[2]);
                    boxGroup.add(corner);
                });

                scene.add(boxGroup);
                ship.userData.detectBox = boxGroup;

                // Add "DETECTED" Text
                const detectCanvas = document.createElement('canvas');
                detectCanvas.width = 128;
                detectCanvas.height = 32;
                const detectCtx = detectCanvas.getContext('2d');
                detectCtx.font = '20px Orbitron';
                detectCtx.fillStyle = '#00ff00';
                detectCtx.fillText('DETECTED', 10, 20);
                const detectTexture = new THREE.CanvasTexture(detectCanvas);
                const detectSpriteMaterial = new THREE.SpriteMaterial({ map: detectTexture, transparent: true });
                const detectSprite = new THREE.Sprite(detectSpriteMaterial);
                detectSprite.scale.set(2, 0.5, 1);
                detectSprite.position.set(ship.position.x, ship.position.y + 1, ship.position.z);
                scene.add(detectSprite);
                ship.userData.detectSprite = detectSprite;
            }
        }

        // Update detected ship visuals and remove after 3 seconds
        if (ship.userData.detected && ship.userData.detectionTime) {
            const elapsed = Date.now() - ship.userData.detectionTime;
            if (elapsed >= 3000) { // 3 seconds
                scene.remove(ship.userData.detectBox);
                scene.remove(ship.userData.detectSprite);
                scene.remove(ship);
                ships.splice(index, 1);

                // Spawn a new ship
                const newShip = new THREE.Mesh(shipGeometry, shipMaterial.clone());
                newShip.rotation.z = Math.PI / 2;
                newShip.position.set(
                    20 + Math.random() * 5,
                    2 + (Math.random() - 0.5) * 10,
                    5.5 + (Math.random() - 0.5) * 10
                );
                newShip.userData = { detected: false, speed: 0.05 + Math.random() * 0.03, detectionTime: null };
                scene.add(newShip);
                const glow = new THREE.PointLight(0x5a4eff, 0.5, 5);
                glow.position.set(0, 0, 0);
                newShip.add(glow);
                ships.push(newShip);
            } else {
                // Update box and sprite position as ship moves
                ship.userData.detectBox.position.copy(ship.position);
                ship.userData.detectSprite.position.set(ship.position.x, ship.position.y + 1, ship.position.z);
            }
        }
    });

    // Update Detection Count
    countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
    countCtx.fillStyle = document.body.classList.contains('dark') ? '#00d4e0' : '#00a4b0';
    countCtx.fillText(`SHIPS DETECTED: ${totalDetections}`, 10, 40);
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

// Navbar Shrink and Background Reveal
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }

    // Background Image Reveal
    const backgroundImage = document.getElementById('background-image');
    const scrollFraction = scrollY / (document.body.scrollHeight - window.innerHeight);
    backgroundImage.style.opacity = Math.min(scrollFraction * 2, 1); // Fully visible at 50% scroll
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
        'demo1': 'https://your-demo-url-1.com',
        'demo2': 'https://your-demo-url-2.com',
        'demo3': 'https://your-demo-url-3.com'
    };
    demoFrame.src = demoUrls[demoId];
    const modal = new bootstrap.Modal(document.getElementById('demoModal'));
    modal.show();
}

// Scroll-Triggered Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            if (entry.target.id === 'scifi-character') {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('#projects .project-card, #about, #contact, #scifi-character').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});