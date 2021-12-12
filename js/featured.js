generateContent("featured", "featured", 15);

    var med_elems = document.getElementsByClassName("med-pics");
    for (var i=0; i<med_elems.length; i++){
        med_elems[i].setAttribute("style", "max-height: 200px;");
    }
