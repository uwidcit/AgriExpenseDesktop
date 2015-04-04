var csvContent = "";
var costOfCycle = 0;

function onReportsPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeReportsUI();

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

function initializeReportsUI() {
    var viewModel = new ViewModel();
    viewModel.init();

}


function ViewModel() {
    var
        cycleListView = document.getElementById("cycleList").winControl,
        resourcesUsedListView = document.getElementById("resourcesUsedList").winControl,
        labourUsedListView = document.getElementById("labourCycleList").winControl,
        purchaseListView = document.getElementById("purchasesList").winControl,
        self = this,
        cycleDataList,
        labourUsedDataList,
        resourcesUsedDataList,
        purchaseDataList;

    this.init = function () {

        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            cycleDataList = new WinJS.Binding.List(e);

            cycleListView.itemDataSource = cycleDataList.dataSource;

            cycleListView.selection.selectAll();
            var selectionCount = cycleListView.selection.count();
           
            //put number of crop cycles in local storage
            localStorage.setItem("cropCycleCount", selectionCount);
            
            if (selectionCount > 0) {
                cycleListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //iterate through all crop cycles
                        var id = item.data.id;
                        var name = item.data.name;
                        var crop = item.data.crop;
                        cropCycleIdsArray.push(id);
                        cropCycleNamesArray.push(name); //insert name  into cropCyclesNamesArray
                        cropCycleCropNamesArray.push(crop);
                    });
                });
              
                //put list of crop cycle ids in local storage to access them in the method below
                var cycleIds = cropCycleIdsArray;
                localStorage.setItem('idsOfCropCycles', JSON.stringify(cycleIds));
            }
        });



        
        //do for loop to get resources used for that individual cycle
        for (var i = 0; i < localStorage.getItem("cropCycleCount") ; i++) {
            var count = 0;
            var retrievedIdArray = JSON.parse(localStorage.getItem('idsOfCropCycles'));                
            myDatabase.purchaseList.getDataForEachCycle(resourceUseageObjectStoreName, retrievedIdArray[i], function (e) {
                    resourcesUsedDataList = new WinJS.Binding.List(e);

                    resourcesUsedListView.itemDataSource = resourcesUsedDataList.dataSource;

                    resourcesUsedListView.selection.selectAll();
                    
                    var selectionCountRU = resourcesUsedListView.selection.count();
                    
                    cropCycleResourceCountArray.push(selectionCountRU);
                    

                    //put them in array in global stores
                    resourcesUsedListView.selection.getItems().then(function (items) {
                        items.forEach(function (item) { //iterate through all crop cycles
                            var purchaseID = item.data.purchaseID;
                            var resourceType = item.data.resourceType;
                            var resourceName = item.data.resourceName;
                            var amountToAdd = item.data.amountToAdd;
                            var quantifier = item.data.quantifier;
                            var useCost = item.data.useCost;

                            

                            //take purchaseID from here and get relevant details
                            myDatabase.purchaseList.getDetailsFromPurchase(purchaseObjectStoreName, purchaseID, function (e) {
                                //purchaseDataList = new WinJS.Binding.List(e);
                                //purchaseListView.itemDataSource = purchaseDataList.dataSource;

                                //set amountPurchased and costOfPurchase in localStorage
                            });

                            var amountPurchased = localStorage.getItem("amountPurchased");
                            var costOfPurchase = localStorage.getItem("costOfPurchase");

                            
                            //add info to array to be read in generateCsvFile
                            resourceUseArray[count] = new resourceUsePerCycle(resourceType, resourceName, amountToAdd, quantifier, useCost, amountPurchased, costOfPurchase);

                            count++;  
                        });
                    });
            });   
        }

        
        
        //do for loop to get resources used for that individual cycle
        for (var i = 0; i < localStorage.getItem("cropCycleCount") ; i++) {
            var countL = 0;
            var retrievedIdArray = JSON.parse(localStorage.getItem('idsOfCropCycles'));


            myDatabase.purchaseList.getLabourForEachCycle(labourObjectStoreName, retrievedIdArray[i], function (e) {
                labourUsedDataList = new WinJS.Binding.List(e);

                labourUsedListView.itemDataSource = labourUsedDataList.dataSource;

                labourUsedListView.selection.selectAll();

                var selectionCountL = labourUsedListView.selection.count(); //amount of employees for that crop cycle
                cycleLabourCountArray.push(selectionCountL);
                

                //put them in array in global stores
                labourUsedListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //iterate through each item in the list (labour list according to crop cycle)
                        var employeeName = item.data.personName;
                        var employeeCost = item.data.cost;

                        cycleLabourArray[countL] = new labourPerCycle(employeeName, employeeCost);
                        countL++;
                    });
                }); 
            }); 
        } 
    };



    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();



}

function getTodaysDate() {
    var currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    var dateInString = day + "-" + month + "-" + year + " " + hours + "-" + minutes;

    return dateInString;
}




function generateCsvFile()
{
    var todaysDate = getTodaysDate();
   
    csvContent = "";
    var position = 0;
    var lPosition = 0;

    

    //Text in the file
    //for each crop cycle
    for (var i = 0; i < cropCycleNamesArray.length; i++) {
        csvContent = csvContent + "Cycle # " + cropCycleIdsArray[i] + " : " + cropCycleCropNamesArray[i].toUpperCase() + "\n";
        var amountOfResources = cropCycleResourceCountArray[i];
        var amountOfEmployees = cycleLabourCountArray[i];
       
        costOfCycle = 0;
       
        var LPrevPosition = lPosition;

        csvContent = csvContent + "Resource                                  Quantity Used                             Cost of Use                               Amount Purchased                    Cost of Purchase: \n\n"

        var startPosition = position; //start position of each new cycle in resourceUse array
        var endPosition = startPosition + amountOfResources; //end position + 1 of each cycle in resourceUse array

//        console.log("start postion:" + startPosition + " end Position:" + endPosition);

        var fertilizerCount = countResourceTypeForEachCycle("Fertilizer", startPosition, endPosition);
        var chemicalCount = countResourceTypeForEachCycle("Chemical", startPosition, endPosition);
        var plantingMaterialCount = countResourceTypeForEachCycle("Planting Material", startPosition, endPosition);
        var soilAmendmentCount = countResourceTypeForEachCycle("Soil Amendment", startPosition, endPosition);
        var otherCount = countResourceTypeForEachCycle("Other", startPosition, endPosition);

        
        //get each different type of material
        if (fertilizerCount > 0) {
            csvContent = csvContent + "Fertilizers\n";
            filterResourcesByType("Fertilizer", amountOfResources, startPosition, endPosition);
        }

        if (chemicalCount > 0 ){
            csvContent = csvContent + "Chemicals\n";
            filterResourcesByType("Chemical", amountOfResources, startPosition, endPosition);
        }

        if (plantingMaterialCount > 0) {
            csvContent = csvContent + "Planting Materials\n";
            filterResourcesByType("Planting Material", amountOfResources, startPosition, endPosition);
        }

        if (soilAmendmentCount > 0) {
            csvContent = csvContent + "Soil Amendments\n";
            filterResourcesByType("Soil Amendment", amountOfResources, startPosition, endPosition);
        }

        if (otherCount > 0) {
            csvContent = csvContent + "Other\n";
            filterResourcesByType("Other", amountOfResources, startPosition, endPosition);
        }



        position = endPosition;

        

        






     //   csvContent = csvContent + "Employees Hired for this Cycle: \n\n"
        for (var m = lPosition; m < amountOfEmployees +LPrevPosition; m++) {

            csvContent = csvContent + "Employee Name: " + cycleLabourArray[m].employeeName + "\n";
            csvContent = csvContent + "Employee Cost: " + cycleLabourArray[m].employeeCost + " \n\n";
            costOfCycle = costOfCycle + parseFloat(cycleLabourArray[m].employeeCost);

            lPosition++;

        }


        csvContent = csvContent + "Total Cost for this cycle : $" + costOfCycle + "\n\n";

        //total cost for this cycle


    }

    var savePicker = new Windows.Storage.Pickers.FileSavePicker();

    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    
    savePicker.fileTypeChoices.insert("Excel Format", [".csv"]);
    
    savePicker.suggestedFileName = "AgriExpense Report-" + todaysDate;

    savePicker.pickSaveFileAsync().then(function (file) {
        if (file) {
            // Prevent updates to the remote version of the file until we finish making changes and call CompleteUpdatesAsync.
            Windows.Storage.CachedFileManager.deferUpdates(file);

            // write to file
            Windows.Storage.FileIO.writeTextAsync(file, csvContent).done(function () {

                // We're finished changing the file so the other app can update the remote version of the file.
                // Completing updates may require Windows to ask for user input.
                Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                    //reset all arrays
                    cropCycleIdsArray.length=0;
                    cropCycleNamesArray.length=0;
                    cropCycleCropNamesArray.length=0;
                    cropCycleResourceCountArray.length=0;
                    resourceUseArray.length = 0;
                    cycleLabourCountArray.length = 0;
                    cycleLabourArray.length = 0;

                });
            });
        } else {
            WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
        }
    });
}

//object declaration. Used to store items in resourceUseArray
function resourceUsePerCycle(rType, rName, rQuantity, rQuantifier, rCost, amountPurchased, costOfPurchase) {
    this.rType = rType;
    this.rName = rName;
    this.rQuantity = rQuantity;
    this.rQuantifier = rQuantifier;
    this.rCost = rCost;
    this.amountPurchased = amountPurchased;
    this.costOfPurchase = costOfPurchase;
};

function labourPerCycle(employeeName, employeeCost) {
    this.employeeName = employeeName;
    this.employeeCost = employeeCost;
};


function filterResourcesByType(resourceType, amountOfResources, startPosition, endPosition) {
    //for each item in the crop cycle - filter by type
    for (var j = startPosition; j < endPosition; j++) {

                 if (resourceUseArray[j].rType == resourceType) {

                //add resource Name to csv file
                var rNameLength = resourceUseArray[j].rName.length; //find length of "rName"
                var paddingAmount = 52 - rNameLength; //calculate number of spaces as padding
                csvContent = csvContent + resourceUseArray[j].rName;
                for (var q = 0; q < paddingAmount; q++) { //add padding to name string
                    csvContent = csvContent + " ";
                }

                //add quantity and quantifier to csv file
                var rQuantityLength = resourceUseArray[j].rQuantity.length + resourceUseArray[j].rQuantifier.length + 1; //find length od quantity string
                var paddingAmount = 52 - rQuantityLength; //calculate number of spaces to add as padding
                csvContent = csvContent + resourceUseArray[j].rQuantity + " " + resourceUseArray[j].rQuantifier;

                for (var q = 0; q < paddingAmount; q++) { //add padding to quantity string
                    csvContent = csvContent + " ";
                }


                //add cost ofuse to csv file
                var rCostOfUseLength = resourceUseArray[j].rCost.length; //find the length of the cost of use string
                var paddingAmount = 52 - rCostOfUseLength; //calculate number of spaces to add as padding
                csvContent = csvContent + resourceUseArray[j].rCost;

                for (var q = 0; q < paddingAmount; q++) { //add padding to cost of use string
                    csvContent = csvContent + " ";
                }

                var amountPurchasedLength = resourceUseArray[j].amountPurchased.length + resourceUseArray[j].rQuantifier.length + 1; //find the length of the amountPurchased String
                var paddingAmount = 52 - amountPurchasedLength; //calculate number of spaces to add
                csvContent = csvContent + resourceUseArray[j].amountPurchased + " " + resourceUseArray[j].rQuantifier; //add padding at the end of this
                for (var q = 0; q < paddingAmount; q++) {
                    csvContent = csvContent + " ";
                }


                csvContent = csvContent + "$" + resourceUseArray[j].costOfPurchase;


                csvContent = csvContent + "\n";
                costOfCycle = costOfCycle + parseFloat(resourceUseArray[j].rCost);

               

         }

    }
    
}

function countResourceTypeForEachCycle(resourceType, startPosition, endPosition) {
    var count = 0;
    for (var c = startPosition; c < endPosition; c++) {
        if (resourceUseArray[c].rType == resourceType) {
            count++;
        }
    }
    return count;
}
