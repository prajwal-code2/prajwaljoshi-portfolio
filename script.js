// Canvas Gradient Animation with Pixelated Effect, Four Diagonal Gradients, Four Colors Simultaneously, and Smooth Transition
console.log("Script loaded");
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    const canvas = document.getElementById('gradient-canvas'); // Fixed typo: getElementById
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
                canvas.width = window.innerWidth * 0.9;
                canvas.height = window.innerHeight * 0.9;
                drawGradients();
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            function drawGradients() {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                const scale = 4;
                tempCanvas.width = canvas.width / scale;
                tempCanvas.height = canvas.height / scale;

                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

                const width = tempCanvas.width;
                const height = tempCanvas.height;
                const centerX = width / 2;
                const centerY = height / 2;

                const gradients = [
                    { gradient: tempCtx.createLinearGradient(0, 0, width, height), stops: [0, 0.33, 0.66, 1] },
                    { gradient: tempCtx.createLinearGradient(width, 0, 0, height), stops: [0, 0.33, 0.66, 1] },
                    { gradient: tempCtx.createLinearGradient(0, height, width, 0), stops: [0, 0.33, 0.66, 1] },
                    { gradient: tempCtx.createLinearGradient(centerX, centerY, 0, 0), stops: [0, 0.33, 0.66, 1] }
                ];

                gradients.forEach((gradientObj, index) => {
                    const cycleOffset = index * (1 / gradients.length);
                    const t = (time + cycleOffset) % 1;
                    const progress = t * (colors.length - 1);

                    const pos1 = ((progress - 1.5) % colors.length + colors.length) % colors.length;
                    const pos2 = ((progress - 0.5) % colors.length + colors.length) % colors.length;
                    const pos3 = ((progress + 0.5) % colors.length + colors.length) % colors.length;
                    const pos4 = ((progress + 1.5) % colors.length + colors.length) % colors.length;

                    const color1 = interpolateColor(colors[Math.floor(pos1)], colors[(Math.floor(pos1) + 1) % colors.length], pos1 % 1);
                    const color2 = interpolateColor(colors[Math.floor(pos2)], colors[(Math.floor(pos2) + 1) % colors.length], pos2 % 1);
                    const color3 = interpolateColor(colors[Math.floor(pos3)], colors[(Math.floor(pos3) + 1) % colors.length], pos3 % 1);
                    const color4 = interpolateColor(colors[Math.floor(pos4)], colors[(Math.floor(pos4) + 1) % colors.length], pos4 % 1);

                    gradientObj.gradient.addColorStop(gradientObj.stops[0], `rgba(${hexToRgb(color1).r}, ${hexToRgb(color1).g}, ${hexToRgb(color1).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[1], `rgba(${hexToRgb(color2).r}, ${hexToRgb(color2).g}, ${hexToRgb(color2).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[2], `rgba(${hexToRgb(color3).r}, ${hexToRgb(color3).g}, ${hexToRgb(color3).b}, 0.8)`);
                    gradientObj.gradient.addColorStop(gradientObj.stops[3], `rgba(${hexToRgb(color4).r}, ${hexToRgb(color4).g}, ${hexToRgb(color4).b}, 0.8)`);
                    tempCtx.fillStyle = gradientObj.gradient;
                    tempCtx.fillRect(0, 0, width, height);
                });

                const radialGradient = tempCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.2);
                const t3 = (Math.sin(time * 0.6) + 1) / 2;
                const rColor1 = interpolateColor(colors[3], colors[0], t3); // Dark Green to Red
                const rColor2 = interpolateColor(colors[6], colors[4], t3); // Purple to Dark Blue
                radialGradient.addColorStop(0, `rgba(${hexToRgb(rColor1).r}, ${hexToRgb(rColor1).g}, ${hexToRgb(rColor1).b}, 0.3)`);
                radialGradient.addColorStop(0.8, `rgba(${hexToRgb(rColor2).r}, ${hexToRgb(rColor2).g}, ${hexToRgb(rColor2).b}, 0.1)`);
                radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                tempCtx.fillStyle = radialGradient;
                tempCtx.fillRect(0, 0, width, height);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

                time += 0.000525;
                requestAnimationFrame(drawGradients);
                console.log("Gradients drawn");
            }

            function interpolateColor(color1, color2, factor) {
                if (!color1 || !color2) {
                    console.error("Invalid color input", { color1, color2 });
                    return '#000000';
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

            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 0, b: 0 };
            }

            requestAnimationFrame(drawGradients);
        }
    }

    const typewriterText = document.getElementById('typewriter-text');
    const cursor = document.getElementById('cursor');
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

    // Contact link functionality (unchanged)
    document.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            const email = 'prajwaljoshi421@gmail.com';
            const phone = '9811789311';
            const linkedinUrl = 'https://www.linkedin.com/in/prajwal-joshi-570935165/';
            const githubUrl = 'https://github.com/prajwal-code2';
            const upworkUrl = 'https://www.upwork.com/freelancers/~0158b40f97683abbe7?mp_source=share';

            switch (type) {
                case 'email':
                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
                    break;
                case 'phone':
                    navigator.clipboard.writeText(phone).then(() => {
                        alert('Phone number copied to clipboard: ' + phone);
                    }).catch(err => {
                        console.error('Failed to copy phone number: ', err);
                    });
                    break;
                case 'linkedin':
                    window.open(linkedinUrl, '_blank');
                    break;
                case 'github':
                    window.open(githubUrl, '_blank');
                    break;
                case 'upwork':
                    window.open(upworkUrl, '_blank');
                    break;
            }
        });
    });

    // Smooth scroll with offset for navbar links and logo
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY;
                const navbarOffset = 100; // Adjust this value (navbar height + padding + buffer, e.g., 60px + 20px + 20px)
                window.scrollTo({
                    top: offsetTop - navbarOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click event to logo for scrolling to Home
    document.querySelector('.logo').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default behavior (if any)
        const target = document.querySelector('#home');
        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.scrollY;
            const navbarOffset = 100; // Same offset as navbar links
            window.scrollTo({
                top: offsetTop - navbarOffset,
                behavior: 'smooth'
            });
        }
    });

    // Testimonial Animation
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const leftColumn = document.querySelector('.left-column');
    const middleColumn = document.querySelector('.middle-column');
    const rightColumn = document.querySelector('.right-column');

    // Hardcoded testimonial data (based on original HTML)
    const testimonials = [
        {
            id: 0,
            review: '"The freelancer did a great Job in setting up these two Python notebooks and I can recommend to work with him."',
            name: 'Philipp Wagner',
            source: 'Upwork'
        },
        {
            id: 1,
            review: '"Prajwal is one of the most sincere, smart, and dedicated freelancers I have ever worked with; he was most resourceful, creative, diligent, alert, polite, and always quick to respond! I will hire him again, for sure! The amazing thing about him was his penchant for prefection."',
            name: 'Mohamed Talib',
            source: 'Upwork'
        },
        {
            id: 2,
            review: '"I had a wonderful experience working with Prajwal. He demonstrated deep expertise in Machine Learning, Convolutional Neural Networks, and Image Processing throughout the project. His commitment to delivering high-quality results and their excellent communication skills made the collaboration highly productive. I would highly recommend Prajwal for any project requiring expertise in these areas."',
            name: 'Kunal Kumar',
            source: 'Upwork'
        },
        {
            id: 3,
            review: '"I was afraid to use upwork, but he pleasantly surprised me, the communication was pleasant and even though I set the rules of what I wanted to do at the beginning and changed them several times over time, he always remodeled the project as I wanted. If I need anything again next time, I will definitely come back to this gentleman."',
            name: 'Petr Zoul',
            source: 'Upwork'
        },
        {
            id: 4,
            review: '"This was my second time working with the worker and I am again extremely satisfied. If I need advice in the future, I will definitely contact them again"',
            name: 'Petr Zoul',
            source: 'Upwork'
        }
    ];

    // Initial setup
    let currentTestimonials = [0, 1, 2]; // Start with testimonials 0, 1, 2
    let availableTestimonials = [3, 4]; // Remaining testimonials

    function createTestimonialCard(id, review, name, source) {
        const card = document.createElement('div');
        card.classList.add('testimonial-card');
        card.innerHTML = `
            <div class="text-container">
                <p class="testimonial-review">${review}</p>
                <p class="testimonial-name">${name}</p>
                <p class="testimonial-source">${source}</p>
            </div>
        `;
        card.dataset.id = id;
        return card;
    }

    function updateTestimonials() {
        leftColumn.innerHTML = '';
        middleColumn.innerHTML = '';
        rightColumn.innerHTML = '';

        const leftCard = createTestimonialCard(
            currentTestimonials[0],
            testimonials[currentTestimonials[0]].review,
            testimonials[currentTestimonials[0]].name,
            testimonials[currentTestimonials[0]].source
        );
        const middleCard = createTestimonialCard(
            currentTestimonials[1],
            testimonials[currentTestimonials[1]].review,
            testimonials[currentTestimonials[1]].name,
            testimonials[currentTestimonials[1]].source
        );
        const rightCard = createTestimonialCard(
            currentTestimonials[2],
            testimonials[currentTestimonials[2]].review,
            testimonials[currentTestimonials[2]].name,
            testimonials[currentTestimonials[2]].source
        );

        leftColumn.appendChild(leftCard);
        middleColumn.appendChild(middleCard);
        rightColumn.appendChild(rightCard);
    }

    function updateSpecificTestimonial(column, id, review, name, source) {
        // Preserve existing card if it exists, update only the content
        let card = column.querySelector('.testimonial-card');
        if (card) {
            card.innerHTML = `
                <div class="text-container">
                    <p class="testimonial-review">${review}</p>
                    <p class="testimonial-name">${name}</p>
                    <p class="testimonial-source">${source}</p>
                </div>
            `;
            card.dataset.id = id;
        } else {
            column.innerHTML = ''; // Clear only if no card exists
            card = createTestimonialCard(id, review, name, source);
            column.appendChild(card);
        }
        // Ensure the new content is rendered without animation interference
        const textContainer = card.querySelector('.text-container');
        if (textContainer) {
            textContainer.style.opacity = ''; // Reset to default (should be 1 from CSS)
            textContainer.style.transform = ''; // Reset to default
            textContainer.classList.remove('disappear-text', 'appear-text'); // Clear animation classes
        }
    }

    function disappearAndReplace() {
        console.log('Starting disappearAndReplace at:', new Date().toISOString());
        // Randomly select a column to replace (0: left, 1: middle, 2: right)
        let columnToReplace = Math.floor(Math.random() * 3);
        while (availableTestimonials.length === 0) {
            availableTestimonials = currentTestimonials.slice(); // Reset available when exhausted
            currentTestimonials = []; // Clear current to refill
        }

        // Ensure different testimonials
        let newId;
        do {
            newId = availableTestimonials[Math.floor(Math.random() * availableTestimonials.length)];
        } while (currentTestimonials.includes(newId));

        // Store the old ID and prepare new ID
        const oldId = currentTestimonials[columnToReplace];
        const columns = [leftColumn, middleColumn, rightColumn];
        const targetColumn = columns[columnToReplace];
        const oldCard = targetColumn.querySelector(`.testimonial-card[data-id="${oldId}"] .text-container`);

        if (oldCard) {
            console.log('Starting disappear animation for ID:', oldId);
            // Start disappear animation
            oldCard.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
            oldCard.classList.add('disappear-text');

            // Wait for disappear animation to complete before updating
            setTimeout(() => {
                console.log('Disappear complete for ID:', oldId);
                // Remove disappear class and update content
                oldCard.classList.remove('disappear-text');
                oldCard.style.opacity = '0'; // Ensure hidden
                oldCard.style.transform = 'translateY(-100%)'; // End position

                // Update the testimonial array
                currentTestimonials[columnToReplace] = newId;
                availableTestimonials = availableTestimonials.filter(id => id !== newId);
                if (!availableTestimonials.includes(oldId)) availableTestimonials.push(oldId);

                // Update only the targeted column with new content
                const newTestimonial = testimonials[newId];
                updateSpecificTestimonial(targetColumn, newId, newTestimonial.review, newTestimonial.name, newTestimonial.source);
                console.log('Updated to new ID:', newId);

                // Get the new card's text container and start appear animation
                const newCard = targetColumn.querySelector(`.testimonial-card[data-id="${newId}"] .text-container`);
                if (newCard) {
                    console.log('Starting appear animation for ID:', newId);
                    newCard.classList.add('appear-text'); // Rely on CSS animation

                    // Wait for appear animation to complete, then ensure visibility
                    setTimeout(() => {
                        console.log('Appear complete for ID:', newId);
                        newCard.classList.remove('appear-text');
                        // Ensure content is visible after animation
                        newCard.style.opacity = '1';
                        newCard.style.transform = 'translateY(0)';

                        // Schedule next change after 5 seconds of visibility
                        setTimeout(() => {
                            console.log('Scheduling next change at:', new Date().toISOString());
                            disappearAndReplace();
                        }, 5000); // 5 seconds visibility
                    }, 2000); // Match appear duration
                }
            }, 2000); // Wait for 2-second disappear animation
        }
    }

    // Initial display
    console.log('Initializing testimonials');
    updateTestimonials(); // Initial full setup
    console.log('Initial setup complete');
    setTimeout(disappearAndReplace, 5000); // Start the cycle after 5 seconds
});