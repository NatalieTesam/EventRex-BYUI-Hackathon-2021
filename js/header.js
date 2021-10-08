(function () {
    window.onscroll = function () {
        var header = document.getElementById('navBar')
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            header.style.fontSize = "12px";
        } else {
            header.style.fontSize = "18px";
        }
    }
})();