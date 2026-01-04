var slideIndex = 0; 
var timer = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementsByClassName("carousel-item").length === 0) return; 

    showSlides(slideIndex); 
    autoplay(true);
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (prevBtn) {
        prevBtn.onclick = function() {
            plusSlides(-1);
        };
    }
    if (nextBtn) {
        nextBtn.onclick = function() {
            plusSlides(1);
        };
    }

    indicators.forEach((dot, index) => {
        dot.onclick = function() {
            currentSlide(index);
        };
    });
});

function plusSlides(n){
    clearTimeout(timer);
    showSlides(slideIndex += n);
    autoplay(false); 
}

function currentSlide(n){
    clearTimeout(timer);
    showSlides(slideIndex = n);
    autoplay(false);
}

function showSlides(n){
    var slides = document.getElementsByClassName("carousel-item");
    var dots = document.getElementsByClassName("indicator");

    if (slides.length === 0) return;

    if (n >= slides.length){
        slideIndex = 0; 
    }
    if (n < 0){
        slideIndex = slides.length - 1; 
    }

    for (var i = 0; i < slides.length; i++){
        slides[i].classList.remove('active');
    }

    for(var i = 0; i < dots.length; i++){
        dots[i].classList.remove('active');
    }

    slides[slideIndex].classList.add('active');
    
    dots[slideIndex].classList.add('active');
}

function autoplay(isFirst){
    if (!isFirst){
        setTimeout(() => {
            if (timer) clearTimeout(timer); 
            startTimer();
        }, 500); 
    } else {
        startTimer();
    }
}

function startTimer() {
    var slides = document.getElementsByClassName("carousel-item");
    if (slides.length === 0) return;

    function tick() {
        slideIndex++;
        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        showSlides(slideIndex);
        timer = setTimeout(tick, 4000); 
    }
    
    timer = setTimeout(tick, 4000);
}