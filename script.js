let current = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

const cards = document.querySelectorAll(".card");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");
const dots = document.querySelectorAll(".dot");
const playButtons = document.querySelectorAll(".play");
const audios = document.querySelectorAll("audio");

audios.forEach((audio) => {
    audio.addEventListener("timeupdate", () => {
        const card = audio.closest(".card");
        const progress = card.querySelector(".progress");

        if (!progress || !audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + "%";
    });
});

function updateCarousel() cards.forEach((card, index) => {        
    card.classList.remove("active", "next", "next-2", "prev", "prev-2", "hidden");

    if (index === current) {
        card.classList.add("active");
    } 
    else if (index === (current + 1) % cards.length) {
        card.classList.add("next");
    } 
    else if (index === (current + 2) % cards.length) {
        card.classList.add("next-2");
    } 
    else if (index === (current - 1 + cards.length) % cards.length) {
        card.classList.add("prev");
    } 
    else if (index === (current - 2 + cards.length) % cards.length) {
        card.classList.add("prev-2");
    } 
    else {
        card.classList.add("hidden");
    }
});

    document.querySelectorAll(".play svg").forEach(icon => {
        icon.innerHTML = `
            <path d="M16.75 11.17L10.55 7.04C9.89 6.59 9 7.07 9 7.87V16.13C9 16.93 9.89 17.41 10.55 16.96L16.75 12.83C17.35 12.44 17.35 11.56 16.75 11.17Z"/>
        `;
    });  

    audios.forEach(a => {
        a.pause();
        a.currentTime = 0
    });

    const activeCard = document.querySelector(".card.active");
    const activeAudio = activeCard.querySelector("audio");

    activeAudio.play().catch(() => {});
    
    const activeButton = activeCard.querySelector(".play svg");

    activeButton.innerHTML = `
        <rect x="6" y="5" width="4" height="14"/>
        <rect x="14" y="5" width="4" height="14"/>
    `;

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === current);
    });
}

nextBtn.addEventListener("click", () => {
    current = (current + 1) % cards.length;
    updateCarousel();
});

prevBtn.addEventListener("click", () => {
    current = (current - 1 + cards.length) % cards.length;
    updateCarousel();
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        current = index;
        updateCarousel();
    });
});

playButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const audio = card.querySelector("audio");
        const icon = btn.querySelector("svg");

        if (audio.paused) {
            audios.forEach(a => {
                a.pause();
                
            });

            document.querySelectorAll(".play svg").forEach(icon => {
                icon.innerHTML =  `
                    <path d="M16.75 11.17L10.55 7.04C9.89 6.59 9 7.07 9 7.87V16.13C9 16.93 9.89 17.41 10.55 16.96L16.75 12.83C17.35 12.44 17.35 11.56 16.75 11.17Z"/>
                `;
            });

            audio.play();
            
            icon.innerHTML = 
                `<rect x="6" y="5" width="4" height="14"/>
                <rect x="14" y="5" width="4" height="14"/>`;}

        else {
            audio.pause();

            icon.innerHTML = `
                <path d="M16.75 11.17L10.55 7.04C9.89 6.59 9 7.07 9 7.87V16.13C9 16.93 9.89 17.41 10.55 16.96L16.75 12.83C17.35 12.44 17.35 11.56 16.75 11.17Z"/>
            `;
        }
    });    
});   

document.querySelectorAll(".progress-container").forEach(container => {
    container.addEventListener("click", (e) => {
        const card = container.closest(".card");
        const audio = card.querySelector("audio");

        const width = container.clientWidth;
        const clickX = e.offsetX;

        if (!audio.duration) return;

        audio.currentTime = (clickX / width) * audio.duration;
    });
});

updateCarousel();

const carousel = document.querySelector(".carousel");

function startDrag(x) {
    startX = x;
    currentX = startX;
    isDragging = true;
    carousel.classList.add("dragging");

    carousel.classList.add("dragging");

    cards.forEach(card => {
        card.style.transition = "none";
    });
}

function moveDrag(x) {
    if (!isDragging) return;

    currentX = x;

    const diff = Math.max(-150, Math.min(150, currentX - startX));

    const activeCard = document.querySelector(".card.active");
    if (activeCard) {
        activeCard.style.transform = `translateX(${diff}px) scale(1)`;
    }
}

function endDrag() {
    if (!isDragging) return;

    const diff = (currentX || startX) - startX;

    if (Math.abs(diff) < 10) {
        isDragging = false;
        carousel.classList.remove("dragging");
        return;
    }

    cards.forEach(card => {
        card.style.transition = "";
    });
    
    const activeCard = document.querySelector(".card.active");
    activeCard.style.transform = "";
    
    if (diff < -50) {        
        current = (current + 1) % cards.length;

    } else if (diff > 50) {        
        current = (current - 1 + cards.length) % cards.length;
    }

    updateCarousel();

    isDragging = false;
    carousel.classList.remove("dragging");
}

carousel.addEventListener("touchstart", (e) => {
    startDrag(e.touches[0].clientX);
});

carousel.addEventListener("touchmove", (e) => {
    moveDrag(e.touches[0].clientX);
});

carousel.addEventListener("touchend", endDrag);

carousel.addEventListener("mousedown", (e) => {
   startDrag(e.clientX);
});

window.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX);
});

window.addEventListener("mouseup", endDrag);