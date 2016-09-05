$( document ).ready(function() {
  
  // Variable declarations---------------------------
  
  // Thought about having everything in a 'state' variable, but decided that all the dot notation would get really old really fast
//  var data = {state: "init", number: "integer", currentOp: false, integerVal: 0, accumulator: 0, memVal: 0 };
  
  // State variables
  var number;        // "integer" and "float" - depends on value of 'accumulator'
  var currentOp;
  var pendingOp;     // when user enters 'a + b * c' add will be pendingOp and mult wil be currentOp
  var integerVal;    // integer portion of string that is displayed
  var fractionVal;   // fractional portion of string that is displayed
  var accumulator;   // value of accumulator
  var pendingAdd;
  var register;
  var currentVal;    // numeric value being displayed
  var subtraction;
  var division;
  var negNum;
  var memVal;
  var clickVal;      // value of current mouse click
  var op;            // 'operator' - values are: add sub mult div
  var MAX_LENGTH = 11;
  
  var modalWindow = $('[data-remodal-id=modal]').remodal();
  $('#year').copyRight();
  
  // Audible mouse click
  var click = new Audio("./assets/click.mp3");
  click.volume = 0.2;

  // Function declarations---------------------------
  function showValues() {
    console.log("clickVal is " + clickVal+ ", accumulator is " + accumulator + ", number is " + number + ", integerVal is " + integerVal + ", fractionVal is " + fractionVal);
  }
  
  function clearEntry() {
    number       = "zero";
    integerVal   = "0";
    fractionVal  = ""; 
    updateDisplay();
  }
  function resetValues() {
    clearEntry();
    currentOp    = noOp;
    pendingOp    = noOp;
    pendingAdd   = false;
    subtraction  = false;
    division     = false;
    negNum       = false;
    accumulator  = 0;
    register     = 0;
    currentVal   = 0;
    memVal       = 0;
    clickVal     = "";
    operator     = "";  
    updateDisplay();
  }
  
  function noOp()       {return currentVal;}
  function addTwo(a, b) {return (a+b);}
  // function subTwo(a, b) { subtraction = false; console.log("sub"); return (a-b);}
//  function divTwo(a, b) {return (a/b);}
  function mulTwo(a, b) {
    if (division && b == 0) displayError();
    division = false;
    return (a*b);
  }
  
  
  // Contol keys - On, Off, Clear
  function isControl() {
    switch (clickVal) {
    case "CE": clearEntry(); break;
    case "C": resetValues(); console.log("reset"); break;
    case "Off":
      $(".calculator").fadeOut(300);
      $(".off-message").delay(300).fadeIn(500).delay(1200).fadeOut(500);
      break;
    default: console.log("invalid control value"); break;   
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
          }
          updateDisplay();

        break;
      case "zero":
//        integerVal = "0"; fractionVal = "";        
        if (clickVal === ".") number = "float";
        else if (clickVal === "0") {
          console.log("entering 0 for a 0 value, dummy");
          
        }
        else {
          fractionVal = "";
          number = "integer";
          integerVal = clickVal;
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
    if (subtraction) { currentVal = -currentVal; subtraction = false; }
    if (division)    { currentVal = (1/currentVal); division = false; }
    if (negNum && (number !== "zero")) {
      currentVal = -(currentVal);
      negNum = false;
    }   
    switch (clickVal) {
      case "1/x":
        currentVal = (1/currentVal);
        updateDisplay(currentVal);
        break;
      case "+/-":
        currentVal = -currentVal;
        updateDisplay(currentVal);
        break;
      case "Π":
        currentVal = 3.14159265358979323;
        updateDisplay(currentVal);
        break;
      case "\u221a":                               // square root
console.log("negNum is " + negNum);
console.log("currentVal is " + currentVal);
        if (currentVal >= 0) {
          currentVal = Math.sqrt(currentVal);
          updateDisplay(currentVal);
        } else {
console.log("Square root error " + currentVal);
          displayError();
        }
        break;
      case "%":
        currentVal = currentVal/100;
        updateDisplay(currentVal);
        break;
      case "\xf7":      // invert the next number and treat it as a multiplication
        division = true;

        
      case "\xd7":                             // multiply
        switch(currentOp) {
          case addTwo:
console.log("test 1");
            register = accumulator;
            accumulator = currentVal;
            pendingOp = currentOp;
            break;
          case mulTwo:
console.log("test 2");
            accumulator = currentOp(accumulator, currentVal);
 
            updateDisplay(accumulator);
            break;
          default: 
            accumulator = currentVal;
            break;
        }
        currentOp = mulTwo;
        break;

      
      
      case "-":                     // for subtraction, invert the next number and treat it as addition
        if (number === "zero") {    // entering a negative number
          negNum = !negNum;

          console.log("negNum is  " + negNum);

          updateDisplay();
          break;
        } 
        else subtraction = true; // performing a subtraction operation
 

      
      case "+":        
console.log("current op is  " + currentOp);
console.log("pending op is  " + pendingOp);
console.log("current val is  " + currentVal);
console.log("accumulator is  " + accumulator);
console.log("register is  " + register);
        if (currentOp !== noOp) { 
          accumulator = currentOp(accumulator, currentVal);
        }
        if (pendingOp !== noOp) { 
          accumulator = pendingOp(register, accumulator);
          pendingOp = noOp;
        }
        if (currentOp === noOp) {
          accumulator = currentVal;
        }
        currentOp = addTwo;
        updateDisplay(accumulator);
        break;
      case "=":
console.log("current op is  " + currentOp);
console.log("pending op is  " + pendingOp);
console.log("current val is  " + currentVal);
console.log("accumulator is  " + accumulator);
console.log("register is  " + register);
        currentVal = currentOp(accumulator, currentVal);
         if((pendingOp === addTwo) && (currentOp === mulTwo)) {
              currentVal = addTwo(register,currentVal);
              pendingAdd = false;
              register = 0;
            }

        currentOp = noOp;
        pendingOp = noOp;
        register = 0;
        updateDisplay(currentVal);
        console.log(currentVal); 
        break;
      default:
        console.log("invalid operator - " + clickVal);
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
  
  function flip(num) {
    
  }
  
  function displayError() {$("#value").text("Error");}
  
  // Update the calculator display. If the function receives a parameter, it will be a numeric value.
  // Integer values must have a '.' appended to the end. If no parameter is passed, the function
  // constructs the display from the global variables integerVal and fractionVal
  function updateDisplay(value) {
    if (arguments.length === 1) {
      if (Number.isInteger(value)) $("#value").text(value.toString() + ".");
      else {       // display floating point - need to format output             <-----------
console.log("value is  " + value + ", it is a " + typeof(value));
        $("#value").text(parseFloat(value.toPrecision(MAX_LENGTH)));
      }
    }
    else {
      if ((integerVal.length + fractionVal.length) > MAX_LENGTH) {
        displayError();
        integerVal = "";
        fractionVal = "";
      }
      else if (negNum) $("#value").text("-" + integerVal + "." + fractionVal);
      else $("#value").text(integerVal + "." + fractionVal);
    }
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
  $(document).keypress(function(e) {
    click.play();
    switch (e.which) {
      case 27:
      case 32:
      case 127: clickVal = "C";    isControl(); break;
      case 13:
      case 61: clickVal = "=";    isOperator(); break;
      case 37: clickVal = "%";    isOperator(); break;
      case 42:
      case 88:
      case 120: clickVal = "\xd7"; isOperator(); break;
      case 43: clickVal = "+";    isOperator(); break;
      case 45: clickVal = "-";    isOperator(); break;
      case 46: clickVal = ".";    isValue(); break;
      case 47: clickVal = "\xf7"; isOperator(); break;
      case 48: clickVal = "0"; isValue(); break;
      case 49: clickVal = "1"; isValue(); break;
      case 50: clickVal = "2"; isValue(); break;
      case 51: clickVal = "3"; isValue(); break;
      case 52: clickVal = "4"; isValue(); break;
      case 53: clickVal = "5"; isValue(); break;
      case 54: clickVal = "6"; isValue(); break;
      case 55: clickVal = "7"; isValue(); break;
      case 56: clickVal = "8"; isValue(); break;
      case 57: clickVal = "9"; isValue(); break;
      case 63: modalWindow.open(); break;
      case 80: case 112: clickVal = "Π"; isOperator(); break;
      case 83: case 115: clickVal = "\u221a"; isOperator(); break;
      default:  break; // random keypress - don't care
    }
  });    
});


