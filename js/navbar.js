// Get the container element
var navContainer = document.getElementById("mynav");

// Get all buttons with class="btn" inside the container
var choices = navContainer.getElementsByClassName("page-collection");

console.log("in navbar");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active-menu");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active-menu", "");
        }

        // Add the active class to the current/clicked button
        this.className += " active-menu";
    });
}