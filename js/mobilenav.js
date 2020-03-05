var open_nav = false;

function openMenu(){
    // console.log("opened menu");
    console.log("open_nav:", open_nav);

    var mobile_nav = document.getElementById("mobileNav");

    open_nav = !open_nav;

    if (open_nav) {
        mobile_nav.className = "menu-open";
        mobile_nav.style.height = "300px";
    }
    else{
        mobile_nav.className = "menu-closed";
        mobile_nav.style.height = "0px";
    }
}