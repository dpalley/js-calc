

// want to animation the quote button when page loads
$( document ).ready(function() {
 $("h1").hide().fadeIn(500);
// $("#mainButton").hide().delay(1600).fadeIn(5000).addClass("animated").addClass("bounceIn");
});


$(".calc-btn").mousedown(function(){
    $(this).toggleClass("btn-shadow");
});
$(".calc-btn").mouseup(function(){
    $(this).toggleClass("btn-shadow");
});
