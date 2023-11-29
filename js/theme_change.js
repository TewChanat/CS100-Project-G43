function change_theme(theme) {
    var val = theme.value;
    if (val == "dark") {
        document.body.style.background = "linear-gradient(to right, #000000 55%, #464646)";
        document.body.style.color = "#ffffff";
    } else {
        document.body.style.background = "#ffffff";
        document.body.style.color = "#000000";
    }
}


window.onload = function () {
    var val = localStorage.getItem('theme');
    if (val == "dark") {
        document.body.style.background = "linear-gradient(to right, #000000 55%, #464646)";
        document.body.style.color = "#ffffff";
    } else {
        document.body.style.background = "#ffffff";
        document.body.style.color = "#000000";
    }
    console.log(localStorage.getItem('theme'));
};