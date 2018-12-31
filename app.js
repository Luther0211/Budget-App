//--------------------------------------------------------------------------------------------------------------------------BUDGET CONTROLLER--//
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

  var calculateTotal = function(type) {
    var sum = 0
    data.allItems[type].forEach(function(current) {
      sum += current.value
    })
    data.totals[type] = sum
  }

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //ID = last ID + 1
      //create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1
      } else {
        ID = 0
      }

      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //Push it into our structure
      data.allItems[type].push(newItem)

      //return new element
      return newItem
    },

    calculateBudget: function() {

      // calculate total income & expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the % of income spent
      if(data.totals.inc > 0) {
        data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
      } else {
        data.percentage = -1
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data)
    }
  }

})();



//--------------------------------------------------------------------------------------------------------------------------UI CONTROLLER--//
var UIController = (function() {
  
  var DOMselectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
  }

  return {
    getInput: function() {
      return {
        type : document.querySelector(DOMselectors.inputType).value, // inc or exp
        description : document.querySelector(DOMselectors.inputDesc).value,
        value : parseFloat(document.querySelector(DOMselectors.inputValue).value)
      }
    },

    addListItem: function (obj, type) {
      var html, element;
      //1 create HTML string w/ placeholder text
      if( type === 'inc') {
        element = DOMselectors.incomeContainer
        html = `<div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
      } else if(type === 'exp') {
        element = DOMselectors.expenseContainer
        html = `<div class="item clearfix" id="exp-${obj.id}">
             <div class="item__description">${obj.description}</div>
             <div class="right clearfix">
                 <div class="item__value">${obj.value}</div>
                 <div class="item__percentage">21%</div>
                 <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                 </div>
             </div>
         </div>`
      }
      //2 replace placeholder text w/ actual data

      //3 Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html); 

    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(`${DOMselectors.inputDesc}, ${DOMselectors.inputValue}`)

      //--CLEAR INPUT VALUES--// (all methods work, just wanted to display all posible solutions for this situation)
      // BASIC SOLUTION-----------------------------------------
      // fields[0].value = ""
      // fields[1].value = ""

      // WITH FOR LOOP------------------------------------------
      // for(var i = 0; i < fields.length; i++) {
      //   fields[i].value = ""
      // }

      // MODIFING THE LIST TO AN ARRAY--------------------------
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = ""
      })

      fieldsArr[0].focus();

    },

    displayBudget: function(obj) {

      document.querySelector(DOMselectors.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMselectors.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMselectors.expenseLabel).textContent = obj.totalExp;
      
      if(obj.percentage > 0) {
        document.querySelector(DOMselectors.percentageLabel).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMselectors.percentageLabel).textContent = `---`;
      }

    },

    getDOMselectors: function() {
      return DOMselectors
    }

  }

})();



//--------------------------------------------------------------------------------------------------------------------------GLOBAL APP CONTROLLER--//
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMselectors();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

  }

  var updateBudget = function() {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. return budget
    var budget = budgetCtrl.getBudget();

    //3. Display de budget in UI
    UICtrl.displayBudget(budget);

  }

  var ctrlAddItem = function() {
    var input, newItem;

    //1. Get input field Data
     input = UICtrl.getInput()
    console.log(input)

    if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
      //2. Add the item to budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value)

     //3. Add the item to the UI controller
     UICtrl.addListItem(newItem, input.type);
      
     //4. clear the fields
     UICtrl.clearFields()
 
     //5. calculate & update budget
     updateBudget()
    }
  }

  var ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

    if(itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = splitID[1];

      //1 delete item from data structure


      //2 delete item from UI


      //3 update and show new budget
      

    }

  }

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      })
    }
  }
  
})(budgetController, UIController)

controller.init();