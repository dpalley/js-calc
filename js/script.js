$( document ).ready(function() {
  
  // Variable declarations---------------------------
  
  // Thought about having everything in a 'state' variable, but decided that all the dot notation would get really old really fast
//  var data = {state: "init", number: "integer", pendingOp: false, integerVal: 0, accumulator: 0, memVal: 0 };
  
  // State variables
//  var state       = "init";
  var number;        // "integer" and "float" - depends on value of 'accumulator'
  var pendingOp;
  var integerVal;    // integer portion of string that is displayed
  var fractionVal;   // fractional portion of string that is displayed
  var accumulator;   // value of accumulator
  var register;
  var currentVal;    // numeric value being displayed
  var memVal;
  var clickVal;      // value of current mouse click
  var op;            // 'operator' - values are: add sub mult div
 
  // Audible mouse click
  var click = new Audio("./assets/click.mp3");
  click.volume = 0.2;

  // Function declarations---------------------------
  function showValues() {
    console.log("clickVal is " + clickVal+ ", accumulator is " + accumulator + ", number is " + number + ", integerVal is " + integerVal + ", fractionVal is " + fractionVal);
  }
  
  function resetValues() {
//    state       = "init";
    number       = "zero";
    pendingOp    = "none";
    integerVal   = "0";
    fractionVal  = ""; 
    accumulator  = 0;
    register     = 0;
    currentVal   = 0;
    memVal       = 0;
    clickVal     = "";
    operator     = "";  
    updateDisplay();
  }
  
  function addTwo(a, b) {return (a+b);}
  function subTwo(a, b) {return (a-b);}
  function divTwo(a, b) {return (a/b);}
  function mulTwo(a, b) {return (a*b);}

  // Contol keys - On, Off, Clear
  function isControl() {
    switch (clickVal) {
    case "C": resetValues(); console.log("reset"); break;
    case "Off":
      $(".calculator").fadeOut(300);
      $(".off-message").delay(300).fadeIn(500).delay(1200).fadeOut(500);
      break;
    case "CE": resetValues(); break;

    default:
      console.log("invalid control value");
      break;   
     }        
  }
  
  // Numeric keys, including the decimal point
  function isValue() {
    switch (number) {
      case "float":
        if (clickVal === ".") console.log("can't enter another decimal point");
        else fractionVal += clickVal;
showValues();
        updateDisplay();
        break;
      case "integer":
        if (clickVal === ".") number = "float";
        else {
          integerVal += clickVal;
//          updateDisplay();
          }
          updateDisplay();

        break;
      case "zero":
        integerVal = "0"; fractionVal = "";
        if (clickVal === ".") number = "float";
        else if (clickVal === "0") {
          console.log("entering 0 for a 0 value, dummy");
          
        }
        else {
          number = "integer";
          integerVal = clickVal;
//          updateDisplay();
        }
        updateDisplay();
        break;
      default:
        console.log("invalid number status");
        break;
      }
// showValues();
    }
  
  // Operator keys - multiply, divide, add, subtract, percentage, square root, equals sign
  function isOperator() {
    if (number === "integer") currentVal = parseInt(integerVal);
    if (number === "float") currentVal = parseFloat(integerVal + "." + fractionVal);
    switch (clickVal) {       
      case "\u221a":                               // square root
        accumulator = Math.sqrt(currentVal);
        updateDisplay(accumulator);
        break;
      case "%":
        accumulator = currentVal/100;
        updateDisplay(accumulator);
        break;
      case "\xf7":
        pendingOp = divTwo;
        op = "div";
        register = accumulator;
        accumulator = currentVal; 
        break;                               // divide  "h\u016B"
      case "\xd7":
        pendingOp = mulTwo;
        op = "mult";
        register = accumulator;
        accumulator = currentVal; 
        break;
      case "-":
        pendingOp = subTwo;
        op = "sub";
        pendingOp = "sub";
        register = accumulator;
        accumulator = currentVal;
        pendingOp = true;
        break;
      case "+":
        pendingOp = addTwo;
        op = "add";
        pendingOp = "add";
        register = accumulator;
        accumulator = currentVal;
        pendingOp = true;
        break;
      case "=":
  console.log(accumulator + " " + currentVal);
        switch (op) {
          case "add": accumulator += currentVal; break;
          case "sub": accumulator -= currentVal; break;
          case "mult": accumulator *= currentVal; break;
          case "div": accumulator /= currentVal; break;
        }
        pendingOp = "none";
        register = 0;
        updateDisplay(accumulator);
        console.log(accumulator); 
        break;
      default:
        console.log("invalid operator");
        break;           
      }
    number = "zero";  // control the input of the next number
  }
  
  // Memory keys - have to figure out what these do (currently, html is class="hide-row")
  function isMemory() {
    switch (clickVal) {        
      case "CM": break;
      case "RM": break;
      case "M-": break;
      case "M+": break;
      case "C": break;
      default:
        console.log("invalid memory");
        break; 
       }    
  }
  
  // Update the calculator display. If the function receives a parameter, it will be a numeric value.
  // Integer values must have a '.' appended to the end. If no parameter is passed, the function
  // constructs the display from the global variables integerVal and fractionVal
  function updateDisplay() {
    if (arguments.length === 1) {
      if (Number.isInteger(arguments[0])) $("#value").text(arguments[0].toString() + ".");
      else {                                 // display floating point - need to format output
        $("#value").text(arguments[0]);
      }
    }
    else $("#value").text(integerVal + "." + fractionVal);
  }
  
  // Mouse down events.
  $(".calc-btn").mousedown(function(){
    $(this).toggleClass("btn-shadow btn-press");
    click.play();
    clickVal = $(this).text().trim();
    if ($(this).hasClass("value")) isValue();          // digits and the decimal point
    if ($(this).hasClass("control")) isControl();      // On/Off/Clear
    if ($(this).hasClass("operator")) isOperator();    // Mathematical operators
    if ($(this).hasClass("memory")) isMemory();        // Memory functions (not implemented yet)
  });

  // Mouse up events. Boring
  $(".calc-btn").mouseup(function(){
    $(this).toggleClass("btn-shadow btn-press");
  });

  
  // Code execution starts here  ---------------------------
  resetValues();
  $("h1").hide().fadeIn(500);
  $(".off-message").hide();
   //updateDisplay("0123456789");
  
});




