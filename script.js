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
let filingStatus = undefined;
let annualIncome = 0;
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
  let instructions = document.getElementById("instructions");
  let numbersNodeList = document.getElementsByClassName("num");
  let numbers = Array.from(numbersNodeList);
  let filingStatusEl = document.querySelector('input[name = "filingStatus"]:checked');

  // find selected radio option for filingStatus
  let filingStatus = document.querySelector('input[name = "filingStatus"]:checked').value;

  // listen for changes to filingStatus
  var radios = document.getElementsByClassName('filingStatus');
  for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
      filingStatus = this.value;
      console.log(`filingStatus: ${filingStatus}`);
      }
  }


  // Restrict input to digits and '.' with regex filter.
  setInputFilter(displayEl, function(value) {
    return /^\d*\.?\d*$/.test(value);
  });

  // listen for changes to display
  displayEl.addEventListener("change", function(event) {
    annualIncome = Number(this.value);
  });

  // number button functionality
  numbers.forEach(num =>
    num.addEventListener("click", function(event) {
      console.log(event.target.value);
      val = event.target.value;
      displayVal = annualIncome.toString();

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

      annualIncome = parseFloat(displayVal);
      console.log(typeof annualIncome);
      console.log(`annualIncome: ${annualIncome}`);
      prevNum = val;
    })
  );


  // formulas

  const federalTaxBrackets = {
    rates: [10, 12, 22, 24, 32, 35]
    single: [0, 9950, 40525, 86375, 164925, 209425],
    joint: [0, 19900, 81050, 172750, 329850,418850]
  };

  const stateTaxBrackets = {
    rates: [5, 7, 9, 9.9]
    single: [0, 3550, 8900, 125000],
    joint: [0, 7100, 17800, 250000]
  };

  const federalTaxAmount = () => {
    console.log(`running fTA function`);
    let standardDeduction = 0;
    if (filingStatus === "single") {
      standardDeduction =  12400;
    } else if (filingStatus === "joint") {
      standardDeduction =  24800;
    } else if (filingStatus === "hoh") {
      standardDeduction =  18650;
    }
    console.log(`standardDeduction: ${standardDeduction}`);
    console.log(`annualIncome: ${annualIncome}`);
    let aGI = annualIncome - standardDeduction;
    console.log(`aGI: ${aGI}`);
    const marginalTaxRate = () => {

    }
    return aGI * marginalTaxRate;
  }

  const stateTaxAmount = () => {
    let standardDeduction = 0;
    if (filingStatus === "single") {
      standardDeduction =  12400;
    } else if (filingStatus === "joint") {
      standardDeduction =  24800;
    } else if (filingStatus === "hoh") {
      standardDeduction =  18650;
    }
    console.log(`standardDeduction: ${standardDeduction}`);
    let aGI = annualIncome - standardDeduction;
    console.log(`aGI: ${aGI}`);
  }

  let totalTaxAmount = federalTaxAmount() + stateTaxAmount();

  // generate results string and message
  function resultsString(annualIncome, federalTaxAmount, stateTaxAmount, totalTaxAmount) {
    return `<p>If your combined annual household income is $${annualIncome}, the Federal taxes owed on your hazard pay check will be approximately <strong>$${federalTaxAmount.toFixed(2)}</strong>. The State taxes will be approximately <strong>$${stateTaxAmount.toFixed(2)}</strong>. The total amount you should set aside for 2021 taxes is <strong>$${totalTaxAmount.toFixed(2)}</strong></p>`
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
    messageStart.setAttribute("style", "height: 0; display:none;");
    messageEnd.setAttribute("style", "display:block;");
    displayEl.value = totalTaxAmount;
    console.log(`federalTaxAmount: ${federalTaxAmount()}`);
    console.log(`stateTaxAmount: ${stateTaxAmount()}`);
    console.log(`totalTaxAmount: ${totalTaxAmount}`);
    results.innerHTML = resultsString(annualIncome, federalTaxAmount(), stateTaxAmount(), totalTaxAmount);

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
