
function generateContent(folder, namestem, num){
    for (var i=1; i<(num+1); i++){

        var image_source = "pictures/" + folder + "/" + namestem + i + ".jpg";

        // <!--<img class="med-pics" onclick="openModal();currentSlide(1)" src="img/birds_acrylic.JPG">-->

        var med_elem = document.createElement("img");
        med_elem.setAttribute("src", image_source);
        med_elem.setAttribute("class", "med-pics");
        med_elem.setAttribute("onclick", "openModal(); currentSlide(" + i + ")");
        document.getElementById("medium-section").appendChild(med_elem);

//     <!--<div class="mySlides">-->
//     <!--<img class="modal-pics" src="img/birds_acrylic.JPG">-->
// <!--</div>-->

        var modal_elem = document.createElement("img");
        modal_elem.setAttribute("src", image_source);
        modal_elem.setAttribute("class", "modal-pics");

        var slide_div = document.createElement("div");
        slide_div.className = "mySlides";

        document.getElementById("slide-area").appendChild(slide_div);
        slide_div.appendChild(modal_elem);

        //     <!--<div class="column" id="thumb1">-->
//     <!--<img class="demo" src="img/birds_acrylic.JPG" onclick="currentSlide(1)" alt="Birds 1">-->
// <!--</div>-->

        var thumb_elem = document.createElement("img");
        thumb_elem.setAttribute("src", image_source);
        thumb_elem.setAttribute("class", "demo");
        thumb_elem.setAttribute("onclick", "currentSlide(" + i + ")");
        thumb_elem.setAttribute("alt", namestem + " " + i);

        var thumb_div = document.createElement("div");
        thumb_div.className = "column";
        thumb_div.setAttribute("id", "thumb" + i);

        document.getElementById("thumbs").appendChild(thumb_div);
        thumb_div.appendChild(thumb_elem);

    }


}
//loop through 11 images in art_pictures/boxes and add to screen