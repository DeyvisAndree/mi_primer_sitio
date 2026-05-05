document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.slider-wrapper');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    let autoPlayInterval;

    // Variables para el arrastre (Mouse y Touch)
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // --- FUNCIONES PRINCIPALES ---

    function updateSlider() {
        currentTranslate = index * -100;
        prevTranslate = currentTranslate;
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(${currentTranslate}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
        index = (index < dots.length - 1) ? index + 1 : 0;
        updateSlider();
    }

    function prevSlide() {
        index = (index > 0) ? index - 1 : dots.length - 1;
        updateSlider();
    }

    // --- EVENTOS DE RATÓN (MOUSE DRAG) ---

    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('mousemove', dragAction);
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('mouseleave', dragEnd);

    // Evitar que las imágenes se arrastren por defecto
    wrapper.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    function dragStart(e) {
        isDragging = true;
        startPos = e.clientX;
        wrapper.style.transition = 'none'; // Quitar transición para que siga al mouse
        clearInterval(autoPlayInterval); // Pausar autoplay al arrastrar
    }

    function dragAction(e) {
        if (!isDragging) return;
        const currentPosition = e.clientX;
        const diff = currentPosition - startPos;
        
        // Calcular el movimiento en porcentaje relativo al ancho del contenedor
        const move = prevTranslate + (diff / wrapper.offsetWidth) * 100;
        wrapper.style.transform = `translateX(${move}%)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        const endPos = e.clientX;
        const movedBy = endPos - startPos;

        // Umbral de 50px para cambiar de slide
        if (movedBy < -50) {
            nextSlide();
        } else if (movedBy > 50) {
            prevSlide();
        } else {
            updateSlider(); // Volver a la posición actual si no se movió lo suficiente
        }
        startAutoPlay();
    }

    // --- LÓGICA TÁCTIL (MÓVIL) ---
    // Reutilizamos la lógica de drag para móviles
    wrapper.addEventListener('touchstart', (e) => dragStart(e.touches[0]), { passive: true });
    wrapper.addEventListener('touchmove', (e) => dragAction(e.touches[0]), { passive: true });
    wrapper.addEventListener('touchend', () => dragEnd({ clientX: event.changedTouches[0].clientX }));

    // --- BOTONES Y PUNTOS ---

    document.querySelector('.next-btn').addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            index = i;
            updateSlider();
            resetAutoPlay();
        });
    });

    // --- AUTO-PLAY ---

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // --- INTERSECTION OBSERVER (Animación de entrada) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.info-card').forEach((el) => observer.observe(el));
});