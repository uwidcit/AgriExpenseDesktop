
function onHarvestPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeHarvestUI();

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
            document.getElementById("cycleStartDateID").innerHTML = "Start Date: " + cycleStartDate;

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

function initializeHarvestUI() {
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("harvestForm").addEventListener("submit", viewModel.submitAdd, false);
    
}


function ViewModel() {
    var
        harvestForm = document.getElementById("harvestForm"),
        self = this,
        harvestList,
        dataList;

    this.init = function () {

        myDatabase.purchaseList.getList(harvestObjectStoreName, function (e) {
         dataList = new WinJS.Binding.List(e);       
        });

        myDatabase.purchaseList.getHarvestForEachCycle(harvestObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            harvestList = new WinJS.Binding.List(e); //harvestList should have at most one item in it


            var harvestAmountCalculated = localStorage.getItem("harvestAlreadyPresent");

            if (harvestAmountCalculated == "yes") { //an entry already exixts for this cycle
                harvestList.forEach(countItems);
                function countItems(value, index) { //it should have at MOST one item

                    //re-calculate harvest profit since more items may have been added to the cycle
                    var cycleTotalCost = parseFloat(localStorage.getItem("totalCycleCost"));
                    var amountOfMoneyMade = value.harvestAmount * value.costPerCrop;
                    var profit = amountOfMoneyMade - cycleTotalCost;

                    localStorage.setItem("itemIndex", index);
                    //var profit = parseFloat(value.profit);
                    
                    if (profit < 0) {
                        var loss = profit * (-1);
                        document.getElementById("profitAmount").innerHTML = "Loss: $ " + loss;
                    }
                    else {
                        document.getElementById("profitAmount").innerHTML = "Profit: $ " + profit;
                    }


                    //update database

                    var toDoEdit = {
                        id: parseInt(localStorage.getItem("harvestIdOfEntry")),
                        harvestType: value.harvestType,
                        harvestAmount: value.harvestAmount,
                        costPerCrop: value.costPerCrop,
                        harvestDate: value.harvestDate,
                        profit: profit,
                        cropCycleId: parseInt(localStorage.getItem("cropCycleId")),
                        lvIndex: value.lvIndex
                    };

                    myDatabase.purchaseList.update(toDoEdit, harvestObjectStoreName, function (e) {
                        harvestList.setAt(toDoEdit.lvIndex, toDoEdit);
                       // window.location = "harvest.html"
                    });

                } //end countItems



            }
            else { //no entry exists
                document.getElementById("profitAmount").innerHTML = "Harvest Details Not Entered";
            }

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

        var harvestPresent = localStorage.getItem("harvestAlreadyPresent");

        if (harvestPresent == "no") {
            console.log("no");

            var dp = document.getElementById("harvestDate").winControl;
            var currentDate = dp.current;
            var cycleTotalCost = parseFloat(localStorage.getItem("totalCycleCost"));
            var amountOfMoneyMade = (document.querySelector("#harvestForm .amountHarvested").value) * (document.querySelector("#harvestForm .costPerCrop").value);
            var profit = amountOfMoneyMade - cycleTotalCost; //need to store this value in the database and then get it from there.

            var toDo = {
                harvestType: document.querySelector("#harvestForm .measurement").value,
                harvestAmount: document.querySelector("#harvestForm .amountHarvested").value,
                costPerCrop: document.querySelector("#harvestForm .costPerCrop").value,
                harvestDate: currentDate,
                profit: profit,
                cropCycleId: localStorage.getItem("cropCycleId")
            };

            myDatabase.purchaseList.add(toDo, harvestObjectStoreName, function (e) {
                harvestList.push(e);

                harvestForm.reset();
                window.location = "harvest.html"; //refresh page
            });
        }
    
        else if (harvestPresent == "yes") {
            //Need to Update

            console.log("yes, so we need to update");

            var dp = document.getElementById("harvestDate").winControl;
            var currentDate = dp.current;
            var cycleTotalCost = parseFloat(localStorage.getItem("totalCycleCost"));
            var amountOfMoneyMade = (document.querySelector("#harvestForm .amountHarvested").value) * (document.querySelector("#harvestForm .costPerCrop").value);
            var profit = amountOfMoneyMade - cycleTotalCost;

            var toDoEdit = {
                id: parseInt(localStorage.getItem("harvestIdOfEntry")),
                harvestType: document.querySelector("#harvestForm .measurement").value,
                harvestAmount: document.querySelector("#harvestForm .amountHarvested").value,
                costPerCrop: document.querySelector("#harvestForm .costPerCrop").value,
                harvestDate: currentDate,
                profit: profit,
                cropCycleId: parseInt(localStorage.getItem("cropCycleId")),
                lvIndex: parseInt(localStorage.getItem("itemIndex"))
            };
            
           
            //update entry
            myDatabase.purchaseList.update(toDoEdit, harvestObjectStoreName, function (e) {
                harvestList.setAt(toDoEdit.lvIndex, toDoEdit);

                window.location = "harvest.html"
            });

           

        }

       






       


      


    };






}
