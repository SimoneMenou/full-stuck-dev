const localisation = document.querySelector("div.time1");


const refresh = function refresh () {
    //Dans localisation qui pointe sur la div on veux indiquer l'heure de belgique
    const output=  localisation.querySelector("output");
    const present = luxon.DateTime.now();
    output.innerHTML = present.toFormat("DDDD/HH:mm:ss");
    
}
refresh();
setInterval(function () {
    refresh();
},1000)

// Scroll down arrow
document.addEventListener("DOMContentLoaded", () => {
  const arrow = document.querySelector(".scroll-down");
  if (arrow) {
    arrow.addEventListener("click", () => {
      document.querySelector("#article1").scrollIntoView({ behavior: "smooth" });
    });
  }
});
