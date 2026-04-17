const slider = document.querySelector('.slider');
const cardContainers = document.querySelectorAll('.card-container');
let rotation = 0;
let isHovered = false;

// 1. Track hover state
slider.addEventListener('mouseenter', () => { isHovered = true; });
slider.addEventListener('mouseleave', () => { isHovered = false; });

// 2. Click logic - Simplified
cardContainers.forEach(cardContainer => {
    const card = cardContainer.querySelector('.card');
    
    cardContainer.addEventListener('click', function() {
        // Toggle the lock state
        this.classList.toggle('manual-lock');
        
        // Toggle the visual state: 
        // If it's currently rotated 180, set to 0. Otherwise set to 180.
        const currentRot = card.style.getPropertyValue('--card-flip');
        card.style.setProperty('--card-flip', currentRot === '180deg' ? '0deg' : '180deg');
    });
});

// 3. Logic to update card flip state
function updateCardVisibility(currentRotation) {
    cardContainers.forEach((cardContainer, index) => {
        const card = cardContainer.querySelector('.card');
        const cardBaseRotation = (index) * (360 / cardContainers.length);
        let netRotation = ((currentRotation + cardBaseRotation) % 360 + 360) % 360;

        const isAtBack = netRotation > 90 && netRotation < 290;
        const isLocked = cardContainer.classList.contains('manual-lock');

        if (isAtBack && isLocked) {
            card.style.setProperty('--card-flip', '360deg'); // extra flip to face viewer
        } else if (isAtBack) {
            card.style.setProperty('--card-flip', '180deg');
        } else {
            card.style.setProperty('--card-flip', isLocked ? '180deg' : '0deg');
        }
    });
}

let targetRotation = 0; // Where we want to be
let currentRotation = 0; // Where we are now

let isThrottled = false;
const THROTTLE_TIME = 50; // ms: Limits updates to 20 per second

slider.addEventListener('wheel', (event) => {
    if (isHovered) {
        event.preventDefault();

        // If currently throttled, ignore this event
        if (isThrottled) return;

        // Apply throttle
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, THROTTLE_TIME);

        // --- CAPPING SPEED ---
        // Limit the impact of a single scroll
        const maxDelta = 30;
        const delta = Math.max(-maxDelta, Math.min(maxDelta, event.deltaY));
        
        targetRotation += delta * 0.3;
    }
}, { passive: false });

// Animation Loop: This runs every frame (~60fps)
function animate() {
    // Smoothly interpolate current towards target (e.g., 10% per frame)
    currentRotation += (targetRotation - currentRotation) * 0.1;
    
    // Apply transforms
    slider.style.transform = `perspective(1000px) rotateY(${currentRotation}deg)`;
    updateCardVisibility(currentRotation);
    
    requestAnimationFrame(animate);
}

cardContainers.forEach(c => c.querySelector('.card').style.transition = 'none');
updateCardVisibility(0);
cardContainers.forEach(c => c.querySelector('.card').offsetHeight);
cardContainers.forEach(c => c.querySelector('.card').style.transition = '');

// Start the loop
animate();
