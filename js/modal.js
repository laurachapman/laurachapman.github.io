function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    // var thumbnail = document.getElementById("thumb" + slideIndex);
    // thumbnail.style.opacity = "0.6";

    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");

    // var thumbnail = document.getElementById("thumb" + n);
    // thumbnail.style.opacity = "1";

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.code === 'ArrowLeft') {
        plusSlides(-1)
    }
    else if (e.code === 'ArrowRight') {
        plusSlides(1)
    }
}