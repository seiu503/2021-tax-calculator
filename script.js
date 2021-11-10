// todo:
// check calcbtn functionality
// test keyboard functionality
// c2a member form after results displayed
// test on phone


// Restricts input for the textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

// set global variables
let COLA1 = .0215;
let COLA2 = .03;
let step  = .047;
let toppedOut = false;
let basePay = 0;
let prevNum = null;

document.addEventListener("DOMContentLoaded", function(){

  // save elements to variables for later access
  let displayEl = document.getElementById("display");
  let dispwrap = document.getElementById("dispwrap");
  let submit = document.getElementById("submit");
  let startOver = document.getElementById("startOver");
  let keys = document.getElementById("keys");
  let buttonsNodeList = document.getElementsByClassName("calcbtn");
  let buttons = Array.from(buttonsNodeList);
  let results = document.getElementById("results");
  let toppedOutEl = document.getElementById("toppedOut");
  let instructions = document.getElementById("instructions");
  let numbersNodeList = document.getElementsByClassName("num");
  let numbers = Array.from(numbersNodeList);

  // listen for changes to toppedOut
  toppedOutEl.addEventListener("change", function(event) {
    toppedOut = this.checked;
    console.log(`toppedOut: ${toppedOut}`);
  });


  // Restrict input to digits and '.' with regex filter.
  setInputFilter(displayEl, function(value) {
    return /^\d*\.?\d*$/.test(value);
  });

  // listen for changes to display
  displayEl.addEventListener("change", function(event) {
    basePay = Number(this.value);
  });

  // number button functionality
  numbers.forEach(num =>
    num.addEventListener("click", function(event) {
      console.log(event.target.value);
      val = event.target.value;
      displayVal = basePay.toString();

      // decimal point can only be used once
      if (prevNum === "." && displayVal.indexOf('.') == -1) {
        displayVal += `.${val}`;
      } else if ((val === "." && displayVal.indexOf('.') == -1) || (val !== ".")) {
        displayVal += val;
      }

      if (displayVal.charAt(0) === '0') {
        displayVal = displayVal.substr(1);
      }
      console.log(displayVal);
      console.log(prevNum);
      displayEl.value = displayVal;
      console.log(displayEl.value);

      basePay = parseFloat(displayVal);
      console.log(typeof basePay);
      console.log(`basePay: ${basePay}`);
      prevNum = val;
    })
  );


  // formulas
  function monthlyRaise(basePayVar, year) {
    if (!basePayVar) {basePayVar = basePay}
    if (year !== 2 && toppedOut) {
      // formula for raise in year 1 for topped out (COLA1 only, no step)
      let raise = basePayVar * COLA1;
      return Number(raise);
    } else if (year !== 2) {
      // formula for raise in year 1 for not topped out (COLA1 plus step)
      let raise = (basePayVar * COLA1) + (basePayVar * step);
      return Number(raise);
    } else {
      // formula for raise in year 2 (COLA2 + everybody gets a step)
      let raise = (basePayVar * COLA2) + (basePayVar * step);
      return Number(raise);
    }
  }

  function newBasePay(monthlyRaiseAmount, basePayVar) {
    if (!basePayVar) {basePayVar = basePay}
    const monthlyRaise_ = Number(monthlyRaiseAmount);
    let newPay = basePayVar + monthlyRaise_;
    return newPay;
  }

  function firstYearRaise() {
    const firstYearRaiseAmount = monthlyRaise();
    return firstYearRaiseAmount;
  }

  function firstYearBasePay() {
    const monthlyRaiseAmount = monthlyRaise();
    const firstYearBasePayAmount = newBasePay(monthlyRaiseAmount);
    return firstYearBasePayAmount;
  }

  function secondYearRaise(firstYearBasePayAmount) {
    const basePayAmount = Number(firstYearBasePayAmount);
    const secondYearRaiseAmount = monthlyRaise(basePayAmount, 2);
    return secondYearRaiseAmount;
  }

  function secondYearBasePay(firstYearBasePayAmount) {
    const basePayAmount = Number(firstYearBasePayAmount);
    const secondYearRaiseAmount = Number(monthlyRaise(basePayAmount, 2));
    const secondYearBasePayAmount = Number(basePayAmount + secondYearRaiseAmount).toFixed(2);
    return Number(secondYearBasePayAmount);
  }

  function totalLifeOfContract() {

    let lifeOfContract = 0;

    if (!toppedOut) {
      let firstCOLATotalImpact = basePay * COLA1 * 24;
      console.log(`firstCOLATotalmpact: ${firstCOLATotalImpact}`);

      let baseRateAfterFirstCOLA = basePay + (basePay * COLA1);
      console.log(`baseRateAfterFirstCOLA: ${baseRateAfterFirstCOLA}`);

      let firstStepTotalImpact = baseRateAfterFirstCOLA * step * 18;
      console.log(`firstStepTotalImpact: ${firstStepTotalImpact}`);

      let baseRateAfterFirstStep = baseRateAfterFirstCOLA + (baseRateAfterFirstCOLA * step);
      console.log(`baseRateAfterFirstStep: ${baseRateAfterFirstStep}`);

      let secondCOLATotalImpact = baseRateAfterFirstStep * COLA2 * 9;
      console.log(`secondCOLATotalImpact: ${secondCOLATotalImpact}`);

      let baseRateAfterSecondCOLA = baseRateAfterFirstStep + ( baseRateAfterFirstStep * COLA2);
      console.log(`baseRateAfterSecondCOLA: ${baseRateAfterSecondCOLA}`);

      let secondStepTotalImpact = baseRateAfterSecondCOLA * step * 6;
      console.log(`secondStepTotalImpact: ${secondStepTotalImpact}`);

      let baseRateAfterSecondStep = baseRateAfterSecondCOLA + (baseRateAfterSecondCOLA * step);
      console.log(`baseRateAfterSecondStep: ${baseRateAfterSecondStep}`);

      lifeOfContract = (firstCOLATotalImpact + firstStepTotalImpact + secondCOLATotalImpact + secondStepTotalImpact).toFixed(2);
      console.log(`lifeOfContractTotal: ${lifeOfContract}`);
    } else {
      let firstCOLATotalImpact = basePay * COLA1 * 24;
      console.log(`firstCOLATotalmpact: ${firstCOLATotalImpact}`);

      let baseRateAfterFirstCOLA = basePay + (basePay * COLA1);
      console.log(`baseRateAfterFirstCOLA: ${baseRateAfterFirstCOLA}`);

      let secondCOLATotalImpact = baseRateAfterFirstCOLA * COLA2 * 9;
      console.log(`secondCOLATotalImpact: ${secondCOLATotalImpact}`);

      let baseRateAfterSecondCOLA = baseRateAfterFirstCOLA + (baseRateAfterFirstCOLA * COLA2);
      console.log(`baseRateAfterSecondCOLA: ${baseRateAfterSecondCOLA}`);

      let secondStepTotalImpact = baseRateAfterSecondCOLA * step * 6;
      console.log(`secondStepTotalImpact: ${secondStepTotalImpact}`);

      let baseRateAfterSecondStep = baseRateAfterSecondCOLA + (baseRateAfterSecondCOLA * step);
      console.log(`baseRateAfterSecondStep: ${baseRateAfterSecondStep}`);

      lifeOfContract = (firstCOLATotalImpact + secondCOLATotalImpact + secondStepTotalImpact).toFixed(2);
      console.log(`lifeOfContractTotal: ${lifeOfContract}`);
    }

    return lifeOfContract;
  }

  // generate results string and message
  function resultsString(firstYearRaiseAmount, secondYearRaiseAmount, lifeOfContractTotal, secondYearBasePayAmount) {
    return `<p>If your base pay is $${basePay}${toppedOut ? " and you are topped out," : ","} your total raise in the first year of the contract${toppedOut ? " after your step increase" : ""} will be <strong>$${firstYearRaiseAmount.toFixed(2)}</strong> per month. In the second year of the contract after your step increase it will be <strong>$${secondYearRaiseAmount.toFixed(2)}</strong> per month. Over the two years of the contract this adds up to an extra <strong>$${lifeOfContractTotal} in your pocket.</strong> And by July 1, 2021, your new monthly base pay will be <strong>$${secondYearBasePayAmount.toFixed(2)}</strong></p>`
  }

  // On reload, reload page
  function handleReload() {
    window.location.reload();
  }

  // On submit, hide keypad and display results
  function handleSubmit() {
    keys.setAttribute("style", "height:0;");
    buttons.forEach(btn =>
      btn.setAttribute("style", "height:0; padding: 0; border: 0; display:none;")
    );
    submit.setAttribute("style", "display:none;");
    startOver.setAttribute("style", "height:3rem; padding: 1rem 0; border: 1px solid white");
    dispwrap.setAttribute("style", "margin-bottom: 0;");
    instructions.setAttribute("style", "height: 0; display:none;");
    message.setAttribute("style", "display:block;");
    let totalLifeOfContractAmount = totalLifeOfContract();
    displayEl.value = totalLifeOfContractAmount;
    let firstYearRaiseAmount = firstYearRaise();
    let firstYearBasePayAmount = firstYearBasePay();
    let secondYearRaiseAmount = secondYearRaise(firstYearBasePayAmount);
    let secondYearBasePayAmount = Number(secondYearBasePay(firstYearBasePayAmount));
    results.innerHTML = resultsString(firstYearRaiseAmount, secondYearRaiseAmount, totalLifeOfContractAmount, secondYearBasePayAmount);

  }

  // Listen for 'Enter' keyup in input field to trigger submit
  displayEl.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  });

  submit.addEventListener("click", handleSubmit);
  startOver.addEventListener("click", handleReload);

});
