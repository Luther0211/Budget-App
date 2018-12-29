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
    testing: function() {
      console.log(data)
    }
  }

})();



//--UI CONTROLLER--//
var UIController = (function() {
  
  var DOMselectors = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  }

  return {
    getInput: function() {
      return {
        type : document.querySelector(DOMselectors.inputType).value, // inc or exp
        description : document.querySelector(DOMselectors.inputDesc).value,
        value : document.querySelector(DOMselectors.inputValue).value 
      }
    },

    addListItem: function (obj, type) {
      var html, element;
      //1 create HTML string w/ placeholder text
      if( type === 'inc') {
        element = DOMselectors.incomeContainer
        html = `<div class="item clearfix" id="income-${obj.id}">
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
        html = `<div class="item clearfix" id="expense-${obj.id}">
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
    var input, newItem;

    //1. Get input field Data
     input = UIController.getInput()
    console.log(input)

    //2. Add the item to budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value)

    //3. Add the item to the UI controller
    UIController.addListItem(newItem, input.type);

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