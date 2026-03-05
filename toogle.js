const checkbox = document.querySelector("#input");

function changeTheme() {
  if (checkbox.checked) {
    document.body.id = "dark";
  } else {
    document.body.id = "";
  }
}

// Auto dark/light based on time (dark: 19h-7h)
function autoTheme() {
  const hour = new Date().getHours();
  const isDark = hour >= 19 || hour < 7;
  checkbox.checked = isDark;
  changeTheme();
}

autoTheme();
