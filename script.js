function openComposer() {
    const composer = document.querySelector('.composer');
    composer.style.display = composer.style.display === 'flex' ? 'none' : 'flex';
    if (composer.style.display === 'flex') {
        document.getElementById('composer-input').focus();
    }
}

function executeCode() {
    const input = document.getElementById('composer-input').value.toLowerCase();
    const codeDisplay = document.getElementById('code-display');
    if (input.includes('web design')) {
        codeDisplay.textContent = `function createWebsite() {
    return "Responsive website created by Prajwal!";
}
console.log(createWebsite());`;
    } else if (input.includes('app')) {
        codeDisplay.textContent = `function buildApp() {
    return "Mobile app developed by Prajwal!";
}
console.log(buildApp());`;
    } else if (input.includes('ai')) {
        codeDisplay.textContent = `function runAI() {
    return "AI solution implemented by Prajwal!";
}
console.log(runAI());`;
    } else {
        codeDisplay.textContent = `function greet(name) {
    return \`Hello, \${name}!\`;
}
console.log(greet("Prajwal"));`;
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Card animation on load
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s';
            card.style.opacity = '1';
        }, index * 200);
    });
});

// Custom cursor (inspired by cursor.com interactivity)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseover', () => {
        cursor.classList.add('cursor-hover');
    });
    element.addEventListener('mouseout', () => {
        cursor.classList.remove('cursor-hover');
    });
});