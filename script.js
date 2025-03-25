// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Three.js renderer initialized');

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Load Robot GLTF Model
    const loader = new THREE.GLTFLoader();
    let robotModel;
    loader.load(
        '/prajwaljoshi-portfolio/model/scene.gltf',
        (gltf) => {
            robotModel = gltf.scene;
            robotModel.scale.set(1, 1, 1);
            robotModel.position.set(-15, 0, 5);
            robotModel.rotation.y = Math.PI / 2;
            scene.add(robotModel);
            console.log('Robot model loaded successfully:', robotModel);

            robotModel.traverse((child) => {
                if (child.isMesh) {
                    console.log('Mesh:', child.name, 'Material:', child.material);
                    if (!child.material.map) {
                        console.log('No texture found, applying fallback color');
                        child.material.color.set(0x00eaff);
                    } else {
                        console.log('Texture:', child.material.map.source);
                    }
                }
            });
        },
        (xhr) => {
            if (xhr.total > 0) {
                console.log((xhr.loaded / xhr.total * 100) + '% robot loaded');
            } else {
                console.log('Loading robot model... (size unknown)');
            }
        },
        (error) => {
            console.error('Error loading robot GLTF model:', error);
            const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(-15, 0, 5);
            scene.add(cube);
            console.log('Fallback cube added due to robot loading failure');
        }
    );

    // Eye (Scanner Source)
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00eaff });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(-14.7, 1, 5.5);
    scene.add(eye);

    // V-Shaped Scanner
    const vShapeGeometry = new THREE.BufferGeometry();
    const vAngle = Math.PI / 12;
    const vLength = 25;
    const vertices = new Float32Array([
        0, 0, 0,
        vLength * Math.cos(vAngle), vLength * Math.sin(vAngle), 0,
        vLength * Math.cos(-vAngle), vLength * Math.sin(-vAngle), 0
    ]);
    vShapeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    vShapeGeometry.setIndex([0, 1, 2]);
    const vShapeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }); // Disable depth write
    const scannerField = new THREE.Mesh(vShapeGeometry, vShapeMaterial);
    scannerField.position.set(-14.7, 1, 5.5);
    scannerField.renderOrder = 0; // Explicitly below bounding boxes
    scene.add(scannerField);

    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    marker.position.set(-14.7, 1, 5.5);
    scene.add(marker);

    // Load Plane GLTF Model for Ships
    let planeModelTemplate;
    const ships = [];
    let totalDetections = 0;
    loader.load(
        '/prajwaljoshi-portfolio/model1/scene.gltf', // Path to plane model
        (gltf) => {
            planeModelTemplate = gltf.scene;
            console.log('Plane model loaded successfully:', planeModelTemplate);

            // Create 8 ship instances
            for (let i = 0; i < 8; i++) {
                const ship = planeModelTemplate.clone();
                ship.scale.set(0.1875, 0.1875, 0.1875); // Current size
                ship.position.set(
                    20 + Math.random() * 5,
                    2 + (Math.random() - 0.5) * 10,
                    5.5 + (Math.random() - 0.5) * 10
                );
                // No dynamic rotation—keep stable, assume default is correct or adjust statically
                // ship.rotation.y = -Math.PI / 2; // Uncomment if nose needs to point left
                ship.userData = { detected: false, speed: 0.05 + Math.random() * 0.03, detectionTime: null };
                scene.add(ship);
                ships.push(ship);

                // Apply fallback material if no texture
                ship.traverse((child) => {
                    if (child.isMesh && !child.material.map) {
                        child.material = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.7 });
                    }
                });

                const glow = new THREE.PointLight(0xff00ff, 0.5, 5);
                glow.position.set(0, 0, 0);
                ship.add(glow);
            }
        },
        (xhr) => {
            if (xhr.total > 0) {
                console.log((xhr.loaded / xhr.total * 100) + '% plane loaded');
            } else {
                console.log('Loading plane model... (size unknown)');
            }
        },
        (error) => {
            console.error('Error loading plane GLTF model:', error);
            // Fallback to cone if plane fails
            const shipGeometry = new THREE.ConeGeometry(0.3, 1.5, 8);
            const shipMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.7 });
            for (let i = 0; i < 8; i++) {
                const ship = new THREE.Mesh(shipGeometry, shipMaterial.clone());
                ship.rotation.z = Math.PI / 2;
                ship.position.set(
                    20 + Math.random() * 5,
                    2 + (Math.random() - 0.5) * 10,
                    5.5 + (Math.random() - 0.5) * 10
                );
                ship.userData = { detected: false, speed: 0.05 + Math.random() * 0.03, detectionTime: null };
                scene.add(ship);
                ships.push(ship);

                const glow = new THREE.PointLight(0xff00ff, 0.5, 5);
                glow.position.set(0, 0, 0);
                ship.add(glow);
            }
            console.log('Fallback to cone ships due to plane loading failure');
        }
    );

    // Detection Count Display
    const countCanvas = document.createElement('canvas');
    countCanvas.width = 1024;
    countCanvas.height = 256;
    const countCtx = countCanvas.getContext('2d');
    countCtx.font = '100px Exo 2';
    countCtx.fillStyle = '#ffffff';
    countCtx.shadowColor = '#00eaff';
    countCtx.shadowBlur = 10;
    const countTexture = new THREE.CanvasTexture(countCanvas);
    const countSpriteMaterial = new THREE.SpriteMaterial({ map: countTexture, transparent: true });
    const countSprite = new THREE.Sprite(countSpriteMaterial);
    countSprite.scale.set(60, 15, 5);
    countSprite.position.set(5, -2, 0);
    countSprite.renderOrder = 1;
    scene.add(countSprite);
    console.log('Counter added at:', countSprite.position);

    // Typewriter Effect
    const typewriterText = document.getElementById('typewriter-text');
    if (!typewriterText) console.error('Typewriter text element not found');
    const titleText = "Computer Vision Specialist";
    const taglineText = "Transforming Pixels into Actionable Insights";
    let currentText = titleText;
    let currentIndex = 0;
    let isErasing = false;
    const typeSpeed = 120;
    const delayBetween = 1500;

    function typeWriter() {
        if (typewriterText) {
            typewriterText.textContent = currentText.slice(0, currentIndex);
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
        }
    }
    typeWriter();

    // Camera
    camera.position.z = 20;

    // Animation Loop
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
    
        time += 0.05;
        const dynamicTilt = Math.sin(time) * Math.PI / 6;
        scannerField.rotation.y = dynamicTilt;
    
        ships.forEach((ship, index) => {
            ship.position.x -= ship.userData.speed;
            if (ship.position.x < -20 && !ship.userData.detected) {
                ship.position.x = 20 + Math.random() * 5;
                ship.position.y = 2 + (Math.random() - 0.5) * 10;
                ship.position.z = 5.5 + (Math.random() - 0.5) * 10;
                ship.traverse((child) => {
                    if (child.isMesh) child.material.opacity = 0.7;
                });
                ship.userData.detected = false;
            }
    
            if (!ship.userData.detected) {
                const relativePos = new THREE.Vector3().subVectors(ship.position, scannerField.position);
                const vDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(scannerField.quaternion);
                const angle = relativePos.angleTo(vDirection);
                const distance = relativePos.length();
                if (angle < vAngle && distance <= vLength) {
                    ship.userData.detected = true;
                    ship.userData.detectionTime = Date.now();
                    totalDetections++;
    
                    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.9 });
                    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                    dot.position.copy(ship.position);
                    scene.add(dot);
                    ship.userData.detectDot = dot;
    
                    const detectCanvas = document.createElement('canvas');
                    detectCanvas.width = 256;
                    detectCanvas.height = 96;
                    const detectCtx = detectCanvas.getContext('2d');
                    detectCtx.font = '48px Exo 2';
                    detectCtx.fillStyle = '#00ff00';
                    detectCtx.fillText('DETECTED', 20, 60);
                    const detectTexture = new THREE.CanvasTexture(detectCanvas);
                    const detectSpriteMaterial = new THREE.SpriteMaterial({ map: detectTexture, transparent: true });
                    const detectSprite = new THREE.Sprite(detectSpriteMaterial);
                    detectSprite.scale.set(5, 1.5, 1);
                    detectSprite.position.set(ship.position.x, ship.position.y + 1, ship.position.z);
                    scene.add(detectSprite);
                    ship.userData.detectSprite = detectSprite;
    
                    const boxGeometry = new THREE.BoxGeometry(3, 0.75, 0.75);
                    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, wireframe: true });
                    const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);
                    boundingBox.position.copy(ship.position);
                    boundingBox.renderOrder = 1; // Above scanner
                    scene.add(boundingBox);
                    ship.userData.boundingBox = boundingBox;
                    console.log('Bounding box created for ship at:', ship.position);
                }
            }
    
            if (ship.userData.detected && ship.userData.detectionTime) {
                const elapsed = Date.now() - ship.userData.detectionTime;
                if (elapsed >= 3000) {
                    if (ship.userData.detectDot) scene.remove(ship.userData.detectDot);
                    if (ship.userData.detectSprite) scene.remove(ship.userData.detectSprite);
                    if (ship.userData.boundingBox) scene.remove(ship.userData.boundingBox);
                    scene.remove(ship);
                    ships.splice(index, 1);
    
                    const newShip = planeModelTemplate ? planeModelTemplate.clone() : new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), shipMaterial.clone());
                    newShip.scale.set(0.1875, 0.1875, 0.1875);
                    newShip.position.set(
                        20 + Math.random() * 5,
                        2 + (Math.random() - 0.5) * 10,
                        5.5 + (Math.random() - 0.5) * 10
                    );
                    newShip.userData = { detected: false, speed: 0.05 + Math.random() * 0.03, detectionTime: null };
                    scene.add(newShip);
                    newShip.traverse((child) => {
                        if (child.isMesh && !child.material.map) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.7 });
                        }
                    });
                    const glow = new THREE.PointLight(0xff00ff, 0.5, 5);
                    glow.position.set(0, 0, 0);
                    newShip.add(glow);
                    ships.push(newShip);
                    console.log('Ship and bounding box removed after 3s at:', ship.position);
                } else {
                    if (ship.userData.detectDot) ship.userData.detectDot.position.copy(ship.position);
                    if (ship.userData.detectSprite) ship.userData.detectSprite.position.set(ship.position.x, ship.position.y + 1, ship.position.z);
                    if (ship.userData.boundingBox) {
                        ship.userData.boundingBox.position.copy(ship.position);
                        ship.userData.boundingBox.visible = true; // Force visibility
                        ship.userData.boundingBox.renderOrder = 1; // Stay above scanner
                    }
                }
            }
        });
    
        countCtx.clearRect(0, 0, countCanvas.width, countCanvas.height);
        countCtx.fillStyle = '#ffffff';
        countCtx.shadowColor = '#00eaff';
        countCtx.shadowBlur = 10;
        countCtx.fillText(`SHIPS DETECTED: ${totalDetections}`, 40, 160);
        countCtx.shadowBlur = 0;
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

        const backgroundImage = document.getElementById('background-image');
        const scrollFraction = scrollY / (document.body.scrollHeight - window.innerHeight);
        const yPosition = scrollFraction * 100;
        backgroundImage.style.backgroundPosition = `center ${yPosition}%`;
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
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('#projects .project-card, #about, #contact').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});