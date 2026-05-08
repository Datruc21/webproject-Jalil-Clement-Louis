const slider = document.querySelector('.slider');
const cardContainers = document.querySelectorAll('.card-container');
const quantity = cardContainers.length;
const anglePerCard = 360 / quantity;

let targetRotation = 0;
let currentRotation = 0;
let isHovered = false;

let isDragging = false;
let startX = 0;
let snapTimeout;
let dragDistance = 0;

let isMobile = window.innerWidth <= 768;
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

slider.addEventListener('mouseenter', () => { isHovered = true; });
slider.addEventListener('mouseleave', () => { isHovered = false; });

// Drag & Drop
const startDrag = (e) => {
    if (isMobile) return;
    isDragging = true;
    dragDistance = 0;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    clearTimeout(snapTimeout);
};

const onDrag = (e) => {
    if (!isDragging || isMobile) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - startX;
    
    dragDistance += Math.abs(diffX); 
    
    targetRotation += diffX * 0.2; 
    startX = currentX;
};

const endDrag = () => {
    if (!isDragging || isMobile) return;
    setTimeout(() => { isDragging = false; }, 50); 
    snapToNearestCard(); 
};


slider.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('mouseup', endDrag);

slider.addEventListener('touchstart', startDrag, {passive: true});
window.addEventListener('touchmove', onDrag, {passive: true});
window.addEventListener('touchend', endDrag);


// rotation of the cards
cardContainers.forEach(cardContainer => {
    const card = cardContainer.querySelector('.card');
    
    cardContainer.addEventListener('click', function(e) {
        // if the mouse has moved more than 5px, it is a drag so we do not flip the card
        if (dragDistance > 5 && !isMobile) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // Else, it is a click so we flip the card
        this.classList.toggle('manual-lock');
        const currentRot = card.style.getPropertyValue('--card-flip');
        card.style.setProperty('--card-flip', currentRot === '180deg' ? '0deg' : '180deg');
    });
});


// scroll with the mouse
let isThrottled = false;
const THROTTLE_TIME = 50;

slider.addEventListener('wheel', (event) => {
    if (isHovered && !isMobile) {
        event.preventDefault();
        if (isThrottled) return;
        isThrottled = true;
        setTimeout(() => { isThrottled = false; }, THROTTLE_TIME);

        const maxDelta = 30;
        const delta = Math.max(-maxDelta, Math.min(maxDelta, event.deltaY));
        
        targetRotation -= delta * 0.3;
        
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(snapToNearestCard, 300);
    }
}, { passive: false });

// Align automatically on the closest card
function snapToNearestCard() {
    const remainder = targetRotation % anglePerCard;
    if (Math.abs(remainder) > anglePerCard / 2) {
        targetRotation += (remainder > 0 ? anglePerCard - remainder : -anglePerCard - remainder);
    } else {
        targetRotation -= remainder;
    }
}

function updateCardVisibility(currentRot) {
    if(isMobile) return; 

    cardContainers.forEach((cardContainer, index) => {
        const card = cardContainer.querySelector('.card');
        const cardBaseRotation = (index) * anglePerCard;
        let netRotation = ((currentRot + cardBaseRotation) % 360 + 360) % 360;

        let distanceFromFront = Math.min(netRotation, 360 - netRotation);
        
        let scale = 1;
        let opacity = 1;

        if (distanceFromFront < anglePerCard * 1.5) {
            scale = 1 + (0.2 * (1 - distanceFromFront / (anglePerCard * 1.5)));
            opacity = 1;
        } else {
            scale = 0.9;
            opacity = Math.max(0.15, 1 - (distanceFromFront / 180));
        }

        cardContainer.style.transform = `scale(${scale})`;
        cardContainer.style.opacity = opacity;

        const isAtBack = netRotation > 90 && netRotation < 270;
        const isLocked = cardContainer.classList.contains('manual-lock');

        if (isAtBack && isLocked) {
            card.style.setProperty('--card-flip', '360deg');
        } else if (isAtBack) {
            card.style.setProperty('--card-flip', '180deg');
        } else {
            card.style.setProperty('--card-flip', isLocked ? '180deg' : '0deg');
        }
    });
}

function animate() {
    if (!isMobile) {
        currentRotation += (targetRotation - currentRotation) * 0.1; 
        slider.style.transform = `perspective(1000px) rotateY(${currentRotation}deg)`;
        updateCardVisibility(currentRotation);
    } else {
        slider.style.transform = 'none';
    }
    requestAnimationFrame(animate);
}

cardContainers.forEach(c => c.querySelector('.card').style.transition = 'none');
updateCardVisibility(0);
cardContainers.forEach(c => c.querySelector('.card').offsetHeight);
cardContainers.forEach(c => c.querySelector('.card').style.transition = '');

animate();