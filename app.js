//--BUDGET CONTROLLER--//
var budgetController = (function() {
  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value
  }
  
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value
  }

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

})();



//--UI CONTROLLER--//
var UIController = (function() {
  
  var DOMselectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function() {
      return {
        type : document.querySelector(DOMselectors.inputType).value, // inc or exp
        description : document.querySelector(DOMselectors.inputDesc).value,
        value : document.querySelector(DOMselectors.inputValue).value 
      }
    },
    getDOMselectors: function() {
      return DOMselectors
    }

  }

})();



//--GLOBAL APP CONTROLLER--//
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMselectors();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    })
  }

  
  var ctrlAddItem = function() {
    //TO DO LIST

    //1. Get input field Data
    var input = UIController.getInput()
    console.log(input)

    //2. Add the item to budget controller

    //3. Add the item to the UI controller
 
    //4. Calculate the budget

    //5. Display de budget in UI
  }

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
    }
  }
  
})(budgetController, UIController)

controller.init();