// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Bounding Boxes (Object Detection)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ddeb, wireframe: true });
const boxes = [];
for (let i = 0; i < 5; i++) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    scene.add(box);
    boxes.push(box);
}

// Neural Nodes and Connections
const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xff4e50 });
const nodes = [];
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff4e50, transparent: true, opacity: 0.5 });
for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    scene.add(node);
    nodes.push(node);
}

// Create connections between nodes
const lines = [];
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[j].position
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            lines.push(line);
        }
    }
}

camera.position.z = 15;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    boxes.forEach(box => {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
    });
    nodes.forEach(node => {
        node.position.y += Math.sin(Date.now() * 0.001 + node.position.x) * 0.02;
    });
    renderer.render(scene, camera);
}
animate();

// Mouse Interaction
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    camera.position.x = mouseX * 5;
    camera.position.y = mouseY * 5;
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
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('#projects .project-card, #about, #contact').forEach(el => {
    observer.observe(el);
});