function clickTab(name) {
    // var elements = document.getElementsByClassName("page-collection")
    // for(var i=0; i<elements.length; i=i+1){
    //     elements[i].style.background = "white"
    // }
    var selected = document.getElementById(name)
    selected.style.background = "pink"
    selected.setAttribute("className", "selected-tab")
    console.log("hellow")
}