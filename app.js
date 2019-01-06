//--------------------------------------------------------------------------------------------------------------------------BUDGET CONTROLLER--//
var budgetController = (function() {
  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
  // this function calculates the percentage
  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = -1;
    }
  };
  // this function retrieves the percentage value
  Expense.prototype.getPercentage = function() {
    return this.percentage
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

    deleteItem: function (type, id) {
      var ids, index
      ids = data.allItems[type].map(function(curr, inx, arr) {
         return curr.id
      })

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1)
      }

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

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(curr) {
        curr.calcPercentage(data.totals.inc)
      })
    },

    getPercentages: function() {
      var allPercentages = data.allItems.exp.map(function(curr) {
        return curr.getPercentage()
      })
      return allPercentages
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
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNumber =  function(num, type) {
    var numSplit, int, dec;
    //1. + || - at the start of the number
    //2. exactly 2 decimal points
    //3. a comma separating the thousands
    
    // ex: 2310.4567 -> + 2,310.46
    //ex2: 2000 -> + 2,000.00

    num = Math.abs(num)
    num = num.toFixed(2);

    numSplit = num.split('.')

    int = numSplit[0]

    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    
    return `${(type === 'exp' ? '-' : '+')} ${int}.${dec}`

  };

  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i)
    }
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
                        <div class="item__value">${formatNumber(obj.value, type)}</div>
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
                 <div class="item__value">${formatNumber(obj.value, type)}</div>
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

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID)

      el.parentNode.removeChild(el)

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
      var type
      if(obj.budget === 0) {
        type = obj.budget.toFixed(2) 
      } else if(obj.budget > 0) {
        type = formatNumber(obj.budget, 'inc');
      } else {
        type = formatNumber(obj.budget, 'exp');
      }
      document.querySelector(DOMselectors.budgetLabel).textContent = type
      document.querySelector(DOMselectors.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(DOMselectors.expenseLabel).textContent = formatNumber(obj.totalExp, "exp");
      
      if(obj.percentage > 0) {
        document.querySelector(DOMselectors.percentageLabel).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMselectors.percentageLabel).textContent = `---`;
      }

    },

    displayPercentages: function(percentagesArr) {
      
      var fields = document.querySelectorAll(DOMselectors.expensesPercentageLabel);

      

      nodeListForEach(fields, function(curr, index) {
        if(percentagesArr[index] > 0){
          curr.textContent = percentagesArr[index] + "%"
        } else {
          curr.textContent = "---"
        }
      })
    },

    displayDate: function() {
      var now, year, month, months;
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      now = new Date()
      year = now.getFullYear()
      month = now.getMonth()
      document.querySelector(DOMselectors.dateLabel).textContent = `${months[month]} ${year}`

    },

    changedType: function() {
      var fields = document.querySelectorAll(`${DOMselectors.inputType},${DOMselectors.inputDesc},${DOMselectors.inputValue}`)
      
      nodeListForEach(fields, function(curr) {
        curr.classList.toggle('red-focus')
      })

      document.querySelector(DOMselectors.inputBtn).classList.toggle('red')

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
    document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType)

  }

  var updateBudget = function() {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. return budget
    var budget = budgetCtrl.getBudget();

    //3. Display de budget in UI
    UICtrl.displayBudget(budget);

  }

  var updatePercentages = function() {
    //1. Calculate percentages
    budgetCtrl.calculatePercentages();

    //2. Read them from the budget controller
    var percentages = budgetCtrl.getPercentages();
    console.log(percentages)
    //3. Display the percentages in the UI
    UICtrl.displayPercentages(percentages);
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

     //6. calculate & update the percentages
     updatePercentages();
    } else {
      alert("Please add a description & value add.")
    }
  }

  var ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

    if(itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]) ;

      //1 delete item from data structure
      budgetCtrl.deleteItem(type, ID)

      //2 delete item from UI
      UICtrl.deleteListItem(itemID)

      //3 update and show new budget
      updateBudget()

      //4. calculate & update the percentages
      updatePercentages();

    }

  }

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
      UICtrl.displayDate();
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