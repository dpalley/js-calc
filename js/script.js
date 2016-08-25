$( document ).ready(function() {
  
  // Variable declarations---------------------------
  
  // Thought about having everything in a 'state' variable, but decided that all the dot notation would get really old really fast
//  var data = {state: "init", number: "integer", addPending: false, displayVal: 0, accumulator: 0, memVal: 0 };
  
  // State variables
  var state       = "init";
  var number      = "integer";
  var addPending  = false;
  var displayVal  = "";
  var accumulator = 0;
  var memVal      = 0;
  var clickVal    = "";

  // Audible mouse click
  var click = new Audio("./assets/click.mp3");
  click.volume = 0.2;

  // Function declarations---------------------------

  // Update the display value  <-- logic to control scientific notation will go here
  function updateDisplay() {
            console.log(clickVal);

    switch (clickVal) {
      case ".":
        console.log("decimal");
        break;
      case "0":
        console.log("zero");
        break;
        case "CM": break;
      case "RM": break;
      case "M-": break;
      case "M+": break;
      case "C": break;
      case "\xf7": console.log("divide"); break;  // divide  "h\u016B"
      case "Off": break;
      case "\xd7": console.log("multiply"); break;
      case "CE": break;
      case "-": break;
      case "\u221a": console.log("root"); break;
      case "%": break;
      case "+": break;
      case "=": break;

      default:
        console.log("digit");
        break;   
       }    
    $("#value").text(clickVal);
  }
  
  // Update the calculator state machine variables. Where the magic happens
  function updateStateMachine() {    
  }
  
  // Mouse down events.
  $(".calc-btn").mousedown(function(){
    $(this).toggleClass("btn-shadow");
    console.log("mouse down");
    click.play();
    clickVal = $(this).text().trim();
    updateStateMachine();
    updateDisplay();
  });

  // Mouse up events. Boring
  $(".calc-btn").mouseup(function(){
    $(this).toggleClass("btn-shadow");
  });

  
  // Code execution starts here  ---------------------------
  $("h1").hide().fadeIn(500);
  updateDisplay("0123456789");
  
});




