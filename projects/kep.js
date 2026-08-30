const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const images = Array.from(document.querySelectorAll('.gallery-img'));

let currentIndex = 0;
let isZoomed = false;

// Kép és képaláírás frissítése
function updateModalImage(index) {
    currentIndex = index;
    const currentImg = images[currentIndex];

    modalImg.src = currentImg.src;
    modalCaption.textContent = currentImg.alt || "";

    if (!currentImg.alt) {
        modalCaption.classList.add('hidden');
    } else {
        modalCaption.classList.remove('hidden');
    }

    resetZoom();
}

// Zoom be/ki
function toggleZoom(e) {
    e.stopPropagation();

    if (!isZoomed) {
        // Kiszámoljuk, hogy a kattintás hol történt a képen belül (%-ban)
        const rect = modalImg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        modalImg.style.transformOrigin = `${x}% ${y}%`;
        modalImg.classList.add('zoomed');
        isZoomed = true;
    } else {
        modalImg.classList.remove('zoomed');
        isZoomed = false;
    }
}

// Zoom visszaállítása
function resetZoom() {
    isZoomed = false;
    modalImg.classList.remove('zoomed');
    modalImg.style.transformOrigin = 'center center';
}

modalImg.addEventListener('click', toggleZoom);

// Megnyitás
images.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        updateModalImage(index);
    });
});

// Bezárás
function closeModal() {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    resetZoom();
}

// Lapozás
function showNext() {
    let nextIndex = (currentIndex + 1) % images.length;
    updateModalImage(nextIndex);
}

function showPrev() {
    let prevIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage(prevIndex);
}

closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.parentElement === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});