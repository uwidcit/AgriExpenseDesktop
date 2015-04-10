/// <reference path="addOtherPurchase.js" />



//var cropCycleId;


function onCyclesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeCycleUI();

            var cycleName = localStorage.getItem("cropCycleName");
            var cycleCrop = localStorage.getItem("cropCycleCrop");
            var cycleTypeOfLand = localStorage.getItem("cropCycleTypeOfLand");
            var cycleLandQuantity = localStorage.getItem("cropCycleLandQuantity");
            var cycleStartDate = localStorage.getItem("cropCycleStartDate");


            var cropCycleIdFromStorage = localStorage.getItem("cropCycleId");
            document.getElementById("cycleNameID").innerHTML = "Cycle Name: " + cycleName;
            document.getElementById("cycleCropID").innerHTML = "Crop: " + cycleCrop;
            document.getElementById("cycleLandTypeID").innerHTML = "Land Type: " + cycleTypeOfLand;
            document.getElementById("cycleLandQuantityID").innerHTML = "Land Quantity: " + cycleLandQuantity;
            // document.getElementById("cycleStartDateID").innerHTML = "Start Date: " + cycleStartDate;

        });
    });
}

function initializeDb() {
    return new WinJS.Promise(function (completed, error, progress) {
        myDatabase.data.init(function () {
            completed();
        });
    });
}

function initializeCycleUI() {
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("harvestForm").addEventListener("submit", viewModel.submitAdd, false);
    
}


function ViewModel() {
    var
        harvestForm = document.getElementById("harvestForm"),
        self = this,
        dataList;

    this.init = function () {

        myDatabase.purchaseList.getList(harvestObjectStoreName, function (e) {
         dataList = new WinJS.Binding.List(e);
        
     });  
    };



    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

  
    this.submitAdd = function (e) {
        e.preventDefault();

        var dp = document.getElementById("harvestDate").winControl;
        var currentDate = dp.current;

        var toDo = {
            harvestType: document.querySelector("#harvestForm .measurement").value,
            harvestAmount: document.querySelector("#harvestForm .amountHarvested").value,
            costPerCrop: document.querySelector("#harvestForm .costPerCrop").value,
            harvestDate: currentDate,
            cropCycleId: localStorage.getItem("cropCycleId")
        };

        var cycleTotalCost = parseFloat(localStorage.getItem("totalCycleCost"));
        var amountOfMoneyMade = toDo.harvestAmount * toDo.costPerCrop;
        var profit = amountOfMoneyMade - cycleTotalCost; //need to store this value in the database and then get it from there

        if (profit < 0) {
            var loss = profit * (-1);
            document.getElementById("profitAmount").innerHTML = "Loss: $ " + loss;

        }
        else {
            document.getElementById("profitAmount").innerHTML = "Profit: $ " + profit;
        }

        //Add To Database


      /*  myDatabase.purchaseList.add(toDo, harvestObjectStoreName, function (e) {
            dataList.push(e);

            //calculate profit details here:
           
        

           // harvestForm.reset();
           // window.location = "harvest.html"; //refresh page
        }); */


    };






}
