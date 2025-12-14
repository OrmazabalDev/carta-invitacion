// main.js
// -----------------------------------------------------
// VARIABLES Y FUNCIONES GLOBALES
// -----------------------------------------------------

const CONFIG = {
  nombres: "Luis R. & Marta M.",
  frase: "“Nos elegimos para siempre”",
  fechaTexto: "14 de Febrero · 2026",
  fechaLimite: "Fecha límite: 7 de Febrero 2026",
  fechaBodaObjeto: new Date(2026, 1, 14, 12, 0, 0), 
  horaCeremonia: "12:00 HRS",
  horaRecepcion: "13:00 HRS",
  
  // Direcciones Completas
  direccionCeremonia: "Capilla Sagrado Corazón de Jesús, Av. San Martín 2954, Mendoza, Argentina",
  direccionRecepcion: "Salón La Arboleda, Barrio La Arboleda, Manzana A Casa 38, Lumiere 3792, Las Heras, Mendoza, Argentina",

  formURL: "https://docs.google.com/forms/d/e/1FAIpQLSeslgqDz3KM_9Ea8DcuAM-aocgv7IOvFu8Ya4vESZK7wx2lQA/viewform?embedded=true", 
  musicaURL: "Somewhere over the Rainbow.mp3",
  
  // URLs de Mapas
  get mapaCeremonia() {
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(this.direccionCeremonia);
  },
  get mapaRecepcion() {
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(this.direccionRecepcion);
  }
};

function abrirMapa(url) {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.error("URL del mapa no definida");
  }
}

function toggleModal(id) {
    const m = document.getElementById(id);
    const c = document.getElementById('mainContent');
    if (id === 'modalRSVP') {
        const iframe = document.getElementById('iframeRSVP');
        if (iframe && !iframe.getAttribute('src')) {
            iframe.src = CONFIG.formURL;
        }
    }
    if (m.classList.contains('modal-active')) {
        m.classList.remove('modal-active'); c.style.filter = "none";
    } else {
        document.querySelectorAll('.modal-active').forEach(x => x.classList.remove('modal-active'));
        m.classList.add('modal-active'); c.style.filter = "blur(2px)";
    }
}

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    const musicBtn = document.getElementById('musicBtn');
    
    if (!audio) return;
    
    if (audio.paused) {
        audio.play();
        musicIcon.classList.remove('fa-play', 'ml-0.5'); 
        musicIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        musicIcon.classList.remove('fa-pause'); 
        musicIcon.classList.add('fa-play', 'ml-0.5');
    }
}

// -----------------------------------------------------
// LÓGICA DE INICIALIZACIÓN
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar Textos
    document.getElementById('txtNombres').innerText = CONFIG.nombres;
    document.getElementById('txtFechaTexto').innerText = CONFIG.fechaTexto;
    document.getElementById('txtFrase').innerText = CONFIG.frase;
    document.getElementById('txtFechaLimite').innerText = CONFIG.fechaLimite;
    document.getElementById('txtHoraCeremonia').innerText = CONFIG.horaCeremonia;
    document.getElementById('txtHoraRecepcion').innerText = CONFIG.horaRecepcion;
    
    const audio = document.getElementById('bgMusic');
    if (audio) audio.src = CONFIG.musicaURL;

    // 2. Inicializar Carrusel
    const sliderTrack = document.getElementById('sliderTrack');
    const dots = document.querySelectorAll('#sliderDots button');
    const touchArea = document.getElementById('touchArea');
    let currentIndex = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        if (!sliderTrack) return;
        const totalSlides = sliderTrack.children.length;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.remove('bg-white/60'); dot.classList.add('bg-white', 'opacity-100', 'scale-110');
            } else {
                dot.classList.add('bg-white/60'); dot.classList.remove('bg-white', 'opacity-100', 'scale-110');
            }
        });
    }

    function startAutoSlide() { 
        stopAutoSlide(); 
        autoSlideInterval = setInterval(() => { goToSlide(currentIndex + 1); }, 3500); 
    }
    function stopAutoSlide() { 
        if (autoSlideInterval) clearInterval(autoSlideInterval); 
    }

    if (sliderTrack) {
        startAutoSlide();
        // Eventos Táctiles
        let startX = 0; let endX = 0;
        if (touchArea) {
            touchArea.addEventListener('touchstart', (e) => { stopAutoSlide(); startX = e.touches[0].clientX; }, {passive: true});
            touchArea.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, {passive: true});
            touchArea.addEventListener('touchend', () => {
                if (!startX || !endX) return;
                if (startX - endX > 50) goToSlide(currentIndex + 1);
                else if (startX - endX < -50) goToSlide(currentIndex - 1);
                startX = 0; endX = 0; startAutoSlide();
            });
        }
    }

    // 3. Autoplay de Música
    if (audio) {
        audio.volume = 0.5;
        const musicIcon = document.getElementById('musicIcon');
        const attemptPlay = () => {
            audio.play().then(() => {
                if (musicIcon) {
                    musicIcon.classList.remove('fa-play', 'ml-0.5'); 
                    musicIcon.classList.add('fa-pause');
                }
                document.removeEventListener('click', attemptPlay);
                document.removeEventListener('touchstart', attemptPlay);
            }).catch(() => { /* Autoplay bloqueado */ });
        };
        attemptPlay();
        document.addEventListener('click', attemptPlay, { once: true });
        document.addEventListener('touchstart', attemptPlay, { once: true });
    }

    // 4. Contador
    function actualizarContador() {
        const diff = CONFIG.fechaBodaObjeto - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        document.getElementById("days").innerText = d < 10 ? "0"+d : d;
        document.getElementById("hours").innerText = h < 10 ? "0"+h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0"+m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0"+s : s;
    }
    setInterval(actualizarContador, 1000);
    actualizarContador();
});
