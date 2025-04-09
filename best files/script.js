// Canvas Gradient Animation with Pixelated Effect, Four Diagonal Gradients, Four Colors Simultaneously, and Smooth Transition
console.log("Script loaded");
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    const canvas = document.getElementById('gradient-canvas');
    if (!canvas) {
        console.error("Canvas element not found");
    } else {
        console.log("Canvas found");
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("2D context not supported");
        } else {
            console.log("2D context acquired");

            let time = 0; // Animation time variable for smooth transitions

            // Array of seven colors as specified
            const colors = [
                '#FF0000', // Red 
                '#800000', // Maroon
                '#FFA500', // Orange
                '#006400', // Dark Green
                '#00008B', // Dark Blue
                '#FF1493', // Dark Pink (Deep Pink)
                '#800080'  // Purple
            ];

            function resizeCanvas() {
                canvas.width = window.innerWidth * 0.9; // Reduced from 0.98 to increase gap (~5% on each side)
                canvas.height = window.innerHeight * 0.9; // Increased to 90vh
                drawGradients();
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            function drawGradients() {
                // Create a temporary canvas for pixelated rendering
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                const scale = 4; // Downscale factor (e.g., 1/4 resolution)
                tempCanvas.width = canvas.width / scale;
                tempCanvas.height = canvas.height / scale;

                // Draw gradients on the temporary canvas at lower resolution
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

                const width = tempCanvas.width;
                const height = tempCanvas.height;
                const centerX = width / 2;
                const centerY = height / 2;

                const gradients = [
                    // Gradient 1: Top-left to Bottom-right (Diagonal)
                    {
                        gradient: tempCtx.createLinearGradient(0, 0, width, height),
                        stops: [0, 0.33, 0.66, 1]
                    },
                    // Gradient 2: Top-right to Bottom-left (Diagonal)
                    {
                        gradient: tempCtx.createLinearGradient(width, 0, 0, height),
                        stops: [0, 0.33, 0.66, 1]
                    },
                    // Gradient 3: Bottom-left to Top-right (Diagonal)
                    {
                        gradient: tempCtx.createLinearGradient(0, height, width, 0),
                        stops: [0, 0.33, 0.66, 1]
                    },
                    // Gradient 4: Center to Top-left (Diagonal)
                    {
                        gradient: tempCtx.createLinearGradient(centerX, centerY, 0, 0),
                        stops: [0, 0.33, 0.66, 1]
                    }
                ];

                gradients.forEach((gradientObj, index) => {
                    const cycleOffset = index * (1 / gradients.length);
                    const t = (time + cycleOffset) % 1; // Continuous cycle from 0 to 1
                    const progress = t * (colors.length - 1); // Progress through the seven colors (0 to 6)

                    // Calculate four evenly spaced color positions with smooth linear transition
                    const pos1 = ((progress - 1.5) % colors.length + colors.length) % colors.length; // Spread across palette
                    const pos2 = ((progress - 0.5) % colors.length + colors.length) % colors.length;
                    const pos3 = ((progress + 0.5) % colors.length + colors.length) % colors.length;
                    const pos4 = ((progress + 1.5) % colors.length + colors.length) % colors.length;

                    const color1 = interpolateColor(
                        colors[Math.floor(pos1)],
                        colors[(Math.floor(pos1) + 1) % colors.length],
                        pos1 % 1
                    );
                    const color2 = interpolateColor(
                        colors[Math.floor(pos2)],
                        colors[(Math.floor(pos2) + 1) % colors.length],
                        pos2 % 1
                    );
                    const color3 = interpolateColor(
                        colors[Math.floor(pos3)],
                        colors[(Math.floor(pos3) + 1) % colors.length],
                        pos3 % 1
                    );
                    const color4 = interpolateColor(
                        colors[Math.floor(pos4)],
                        colors[(Math.floor(pos4) + 1) % colors.length],
                        pos4 % 1
                    );

                    // Assign colors to stops with higher opacity for visibility
                    gradientObj.gradient.addColorStop(gradientObj.stops[0], `rgba(${hexToRgb(color1).r}, ${hexToRgb(color1).g}, ${hexToRgb(color1).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[1], `rgba(${hexToRgb(color2).r}, ${hexToRgb(color2).g}, ${hexToRgb(color2).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[2], `rgba(${hexToRgb(color3).r}, ${hexToRgb(color3).g}, ${hexToRgb(color3).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[3], `rgba(${hexToRgb(color4).r}, ${hexToRgb(color4).g}, ${hexToRgb(color4).b}, 0.8)`);
                    tempCtx.fillStyle = gradientObj.gradient;
                    tempCtx.fillRect(0, 0, width, height);
                });

                // Subtle Radial Overlay on temporary canvas
                const radialGradient = tempCtx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, Math.min(width, height) * 0.2
                );
                const t3 = (Math.sin(time * 0.6) + 1) / 2;
                const rColor1 = interpolateColor(colors[3], colors[0], t3); // Dark Green to Red
                const rColor2 = interpolateColor(colors[6], colors[4], t3); // Purple to Dark Blue
                radialGradient.addColorStop(0, `rgba(${hexToRgb(rColor1).r}, ${hexToRgb(rColor1).g}, ${hexToRgb(rColor1).b}, 0.3)`);
                radialGradient.addColorStop(0.8, `rgba(${hexToRgb(rColor2).r}, ${hexToRgb(rColor2).g}, ${hexToRgb(rColor2).b}, 0.1)`);
                radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                tempCtx.fillStyle = radialGradient;
                tempCtx.fillRect(0, 0, width, height);

                // Draw the pixelated result on the main canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.imageSmoothingEnabled = false; // Disable smoothing for pixelation
                ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

                time += 0.0000325; // Slow increment for smooth transitions (~480-second cycle)
                requestAnimationFrame(drawGradients);
                console.log("Gradients drawn");
            }

            // Helper function to interpolate between two colors
            function interpolateColor(color1, color2, factor) {
                if (!color1 || !color2) {
                    console.error("Invalid color input", { color1, color2 });
                    return '#000000'; // Fallback to black if invalid
                }
                const r1 = parseInt(color1.substr(1, 2), 16);
                const g1 = parseInt(color1.substr(3, 2), 16);
                const b1 = parseInt(color1.substr(5, 2), 16);
                const r2 = parseInt(color2.substr(1, 2), 16);
                const g2 = parseInt(color2.substr(3, 2), 16);
                const b2 = parseInt(color2.substr(5, 2), 16);
                const r = Math.round(r1 + (r2 - r1) * factor);
                const g = Math.round(g1 + (g2 - g1) * factor);
                const b = Math.round(b1 + (b2 - b1) * factor);
                return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            }

            // Helper function to convert hex to RGB
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 0, b: 0 }; // Fallback to black if parsing fails
            }

            requestAnimationFrame(drawGradients);
        }
    }

    const typewriterText = document.querySelector('#typewriter-text');
    const cursor = document.querySelector('#cursor');
    if (!typewriterText || !cursor) {
        console.error("Typewriter elements not found", { typewriterText, cursor });
    } else {
        console.log("Typewriter elements found");
        class Typewriter {
            constructor(textElement, cursorElement, phrases, wait = 2500) {
                this.textElement = textElement;
                this.cursorElement = cursorElement;
                this.phrases = phrases;
                this.wait = parseInt(wait, 10);
                this.txt = '';
                this.phraseIndex = 0;
                this.isDeleting = false;
                this.type();
            }

            type() {
                const currentPhrase = this.phrases[this.phraseIndex];
                const fullTxt = currentPhrase.text;

                if (this.isDeleting) {
                    this.txt = fullTxt.substring(0, this.txt.length - 1);
                } else {
                    this.txt = fullTxt.substring(0, this.txt.length + 1);
                }

                this.textElement.innerHTML = `<span>${this.txt}</span>`;

                let typeSpeed = 100;

                if (this.isDeleting) {
                    typeSpeed /= 2;
                }

                if (!this.isDeleting && this.txt === fullTxt) {
                    typeSpeed = this.wait;
                    this.isDeleting = true;
                } else if (this.isDeleting && this.txt === '') {
                    this.isDeleting = false;
                    this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
                    typeSpeed = 500;
                }

                setTimeout(() => this.type(), typeSpeed);
            }
        }

        new Typewriter(typewriterText, cursor, [
            { text: 'Computer Vision Specialist' },
            { text: 'Transforming Pixels into Actionable Insights' }
        ], 2500);
        console.log("Typewriter initialized");
    }
});