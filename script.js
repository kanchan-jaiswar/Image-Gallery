const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImageIndex = 0;
let filteredItems = [];

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });

        updateFilteredItems();
    });
});

function updateFilteredItems() {
    filteredItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
}

updateFilteredItems();

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        updateFilteredItems();
        
        const img = item.querySelector('img');
        const alt = img.getAttribute('alt');
        
        currentImageIndex = filteredItems.indexOf(item);
        
        openLightbox(img.src, alt);
    });
});

function openLightbox(src, alt) {
    lightbox.classList.add('active');
    lightboxImage.src = src;
    lightboxCaption.textContent = alt;
    updateLightboxCounter();
    document.body.style.overflow = 'hidden';
}

closeBtn.addEventListener('click', () => {
    closeLightbox();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } 
    else if (e.key === 'ArrowLeft') {
        navigatePrevious();
    } 
    else if (e.key === 'ArrowRight') {
        navigateNext();
    }
});

function navigateNext() {
    if (filteredItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
    updateLightboxImage();
}

function navigatePrevious() {
    if (filteredItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const currentItem = filteredItems[currentImageIndex];
    const img = currentItem.querySelector('img');
    const alt = img.getAttribute('alt');
    
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = img.src;
        lightboxCaption.textContent = alt;
        updateLightboxCounter();
        lightboxImage.style.opacity = '1';
    }, 150);
}

function updateLightboxCounter() {
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredItems.length}`;
}

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateNext();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigatePrevious();
});

lightboxImage.style.transition = 'opacity 0.3s ease';
