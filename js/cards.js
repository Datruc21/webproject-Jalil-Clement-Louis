const cards = document.querySelectorAll('.card-container');

cards.forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('is-flipped');
    });
});

let slider = document.querySelector('.slider');
let rotation = 0;


// Listen for scroll/wheel events
window.addEventListener('wheel', (event) => {
    // Adjust the multiplier (0.1) to change the rotation speed
    rotation += event.deltaY * 0.1;
    
    // Apply the transformation
    slider.style.transform = `perspective(1000px) rotateY(${rotation}deg)`;
});