

function onCyclesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeCycleUI();

            localStorage.setItem("totalCycleCost", 0); //initialise the total cost of the cycle
            localStorage.setItem("cycleSelected", "no"); //initialise edit/delete cycle Button
            localStorage.setItem("cycleEdit", "no"); //initialise edit cycle Button
            localStorage.setItem("cycleDelete", "no"); //initialise edit cycle Button

            var cycleName = localStorage.getItem("cropCycleName");
            var cycleIndex = localStorage.getItem("cropCycleIndex");
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
            document.getElementById("cycleTotalCost").innerHTML = "Expenses Summary ";

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
    //document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false);
}


function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
                
        chemicalListView = document.getElementById("chemicalList").winControl,
        fertilizerListView = document.getElementById("fertilizerList").winControl,
        plantingMaterialListView = document.getElementById("plantingMaterialList").winControl,
        soilAmendmentListView = document.getElementById("soilAmendmentList").winControl,
        otherListView = document.getElementById("otherList").winControl,
        labourListView = document.getElementById("labourList").winControl,

        self = this,
        dataListRU,
        chemicalDataList,
        fertilizerDataList,
        plantingMaterialDataList,
        soilAmendmentDataList,
        otherDataList,
        labourDataList,
        dataList;

    this.init = function () {

        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            dataList.reverse();

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;

        });

        //Filter by Material Type - Chemical
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Chemical", localStorage.getItem("cropCycleId"), function (e) {
            chemicalDataList = new WinJS.Binding.List(e);
            chemicalDataList.reverse();

            chemicalListView.itemDataSource = chemicalDataList.dataSource;

            var cCost = 0;
            //iterate through list
            chemicalDataList.forEach(chemicalCost);

            function chemicalCost(value) {
                var chemCost = parseFloat(value.useCost);
                cCost = cCost + chemCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + chemCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("chemicalsUsed").innerHTML = "Chemicals: $" + cCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;

            }


        });

        //Filter by Material Type - Fertilizer
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Fertilizer", localStorage.getItem("cropCycleId"), function (e) {
            fertilizerDataList = new WinJS.Binding.List(e);
            fertilizerDataList.reverse();

            fertilizerListView.itemDataSource = fertilizerDataList.dataSource;

            var fCost = 0;
            //iterate through list
            fertilizerDataList.forEach(fertilizerCost);


            function fertilizerCost(value, index) {
                var fertCost = parseFloat(value.useCost);
                fCost = fCost + fertCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + fertCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("fertilizersUsed").innerHTML = "Fertilizers: $" + fCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;

            }

        });

        //Filter by Material Type - Planting Material
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Planting Material", localStorage.getItem("cropCycleId"), function (e) {
            plantingMaterialDataList = new WinJS.Binding.List(e);
            plantingMaterialDataList.reverse();

            plantingMaterialListView.itemDataSource = plantingMaterialDataList.dataSource;

            var pCost = 0;
            //iterate through list
            plantingMaterialDataList.forEach(plantingMaterialCost);

            function plantingMaterialCost(value, index) {
                var pmCost = parseFloat(value.useCost);
                pCost = pCost + pmCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + pmCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("plantingMaterialsUsed").innerHTML = "Planting Material: $" + pCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;
            }

        });

        //Filter by Material Type - Soil Amendment
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Soil Amendment", localStorage.getItem("cropCycleId"), function (e) {
            soilAmendmentDataList = new WinJS.Binding.List(e);
            soilAmendmentDataList.reverse();

            soilAmendmentListView.itemDataSource = soilAmendmentDataList.dataSource;

            var sCost = 0;
            //iterate through list
            soilAmendmentDataList.forEach(soilAmendmentCost);

            function soilAmendmentCost(value, index) {
                var saCost = parseFloat(value.useCost);
                sCost = sCost + saCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + saCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("soilAmendmentsUsed").innerHTML = "Soil Amendments: $" + sCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;
            }

        });

        //Filter by Material Type - Other
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Other", localStorage.getItem("cropCycleId"), function (e) {
            otherDataList = new WinJS.Binding.List(e);
            otherDataList.reverse();

            otherListView.itemDataSource = otherDataList.dataSource;

            var oCost = 0;
            //iterate through list
            otherDataList.forEach(otherCost);

            function otherCost(value, index) {
                var otherCost = parseFloat(value.useCost);
                oCost = oCost + otherCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + otherCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("otherUsed").innerHTML = "Other: $" + oCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;
            }
        });

        myDatabase.purchaseList.getLabourForEachCycle(labourObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            labourDataList = new WinJS.Binding.List(e);
            labourDataList.reverse();

            labourListView.itemDataSource = labourDataList.dataSource;

            var lCost = 0;
            //iterate through list
            labourDataList.forEach(labourCost);

            function labourCost(value, index) {
                var labourCost = parseFloat(value.cost);
                lCost = lCost + labourCost;
                var p = parseFloat(localStorage.getItem("totalCycleCost")) + labourCost;
                localStorage.setItem("totalCycleCost", p);

                document.getElementById("labourUsed").innerHTML = "Labour: $" + lCost;
                document.getElementById("totalCycleExpenses").innerHTML = "Total Cost: $" + p;
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

    this.selectionChanged = function (args) {
        var
            selectionCount = listView.selection.count();
    };


    this.deleteToDo = function () {
        var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

        //change listview to the appropriate list view
        dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
            var selectionCount = listView.selection.count();
            if (selectionCount > 0) {
                listView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var
                            dbKey = item.data.id,
                            lvKey = item.key;

                        myDatabase.purchaseList.remove(dbKey, resourceUseageObjectStoreName, function () {
                            listView.itemDataSource.remove(lvKey);
                        });
                    });
                });
            }
        }));

        dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

        dialog.defaultCommandIndex = 1;
        dialog.cancelCommandIndex = 1;

        dialog.showAsync();
    };

}

function fertilizerButtonClick() {
    localStorage.setItem("typeButtonClick", "Fertilizer");

    window.location = "addPurchases.html";
}

function deleteFertilizerButtonClick() {
    localStorage.setItem("deleteTypeButtonClick", "Fertilizer");

    window.location = "deleteItemUsed.html";
}

function chemicalButtonClick() {
    localStorage.setItem("typeButtonClick", "Chemical");

    window.location = "addPurchases.html";
}

function deleteChemicalButtonClick() {
    localStorage.setItem("deleteTypeButtonClick", "Chemical");

    window.location = "deleteItemUsed.html";
}

function plantingMaterialButtonClick() {
    localStorage.setItem("typeButtonClick", "Planting Material");

    window.location = "addPurchases.html";
}

function deletePlantingMaterialButtonClick() {
    localStorage.setItem("deleteTypeButtonClick", "Planting Material");

    window.location = "deleteItemUsed.html";
}

function soilAmendmentButtonClick() {
    localStorage.setItem("typeButtonClick", "Soil Amendment");

    window.location = "addPurchases.html";
}

function deleteSoilAmendmentButtonClick() {
    localStorage.setItem("deleteTypeButtonClick", "Soil Amendment");

    window.location = "deleteItemUsed.html";
}

function otherButtonClick() {
    localStorage.setItem("typeButtonClick", "Other");

    window.location = "addPurchases.html";
}

function deleteOtherButtonClick() {
    localStorage.setItem("deleteTypeButtonClick", "Other");

    window.location = "deleteItemUsed.html";
}

function selectCycleEdit() {
    localStorage.setItem("cycleSelected", "yes");
    localStorage.setItem("cycleEdit", "yes");
   
    window.location = "cycles.html"
}

function selectCycleDelete() {
    localStorage.setItem("cycleSelected", "yes");
    localStorage.setItem("cycleDelete", "yes");

    window.location = "cycles.html"
}