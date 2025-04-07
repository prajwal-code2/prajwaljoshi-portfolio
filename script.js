document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect
    const typewriterText = document.getElementById('typewriter-text');
    const texts = ["Computer Vision Specialist", "Transforming Pixels into Actionable Insights"];
    let currentTextIndex = 0;
    let currentIndex = 0;
    let isErasing = false;

    function typeWriter() {
        const currentText = texts[currentTextIndex];
        typewriterText.textContent = currentText.slice(0, currentIndex);

        if (!isErasing && currentIndex < currentText.length) {
            currentIndex++;
            setTimeout(typeWriter, 100);
        } else if (!isErasing && currentIndex === currentText.length) {
            setTimeout(() => { isErasing = true; typeWriter(); }, 1000);
        } else if (isErasing && currentIndex > 0) {
            currentIndex--;
            setTimeout(typeWriter, 50);
        } else if (isErasing && currentIndex === 0) {
            isErasing = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // Modal Functionality
    const modal = document.getElementById('demoModal');
    const demoFrame = document.getElementById('demoFrame');
    const closeModal = document.querySelector('.modal-close');
    const demoButtons = document.querySelectorAll('.demo-btn');

    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const demoId = button.getAttribute('data-demo');
            const demoUrls = {
                'demo1': 'https://placeholder-demo-1.com',
                'demo2': 'https://placeholder-demo-2.com',
                'demo3': 'https://placeholder-demo-3.com'
            };
            demoFrame.src = demoUrls[demoId];
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        demoFrame.src = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            demoFrame.src = '';
        }
    });
});