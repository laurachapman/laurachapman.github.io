
function generateBox(front, back){
    var page = document.getElementById("pageWrapper");
    page.innerHTML += `    <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        ${front}
      </div>
      <div class="flip-card-back">
        ${back}
      </div>
    </div>
  </div>`
}
console.log("hello from laura")
var frontText = [
"What is a good first car?",
"What is the best bean?", 
"Should I get a bike?", 
"What should I do with too many bananas?",
"What is a good first car?",
"What is the best bean?", 
"Should I get a bike?", 
"What should I do with too many bananas?",
"What is a good first car?",
"What is the best bean?", 
"Should I get a bike?", 
"What should I do with too many bananas?",
]
var backText = [
"A used Toyota Corolla hatchback",
"Chickpeas", 
"Yes", 
"Freeze them and make chocolate milkshakes with cocoa and milk",
"A used Toyota Corolla hatchback",
"Chickpeas", 
"Yes", 
"Freeze them and make chocolate milkshakes with cocoa and milk",
"A used Toyota Corolla hatchback",
"Chickpeas", 
"Yes", 
"Freeze them and make chocolate milkshakes with cocoa and milk",
]
for (var i=0; i<frontText.length; i+=1){
    generateBox(frontText[i], backText[i])
}