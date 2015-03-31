
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
        self = this,
        cycleDataList,
        labourUsedDataList,
        resourcesUsedDataList;

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
                            var resourceName = item.data.resourceName;
                            var amountToAdd = item.data.amountToAdd;
                            var quantifier = item.data.quantifier;
                            var useCost = item.data.useCost;

                            resourceUseArray[count] = new resourceUsePerCycle(resourceName, amountToAdd, quantifier, useCost);
                            
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
    var csvContent = "";
    
    var position = 0;
    var lPosition = 0;
    

    //Text in the file
    for (var i = 0; i < cropCycleNamesArray.length; i++) {
        csvContent = csvContent + " " + cropCycleNamesArray[i].toUpperCase() + " : " + cropCycleCropNamesArray[i].toUpperCase() + "\n";
        var amountOfResources = cropCycleResourceCountArray[i];
        var amountOfEmployees = cycleLabourCountArray[i];
        var costOfCycle = 0;
       
       
        var prevPostion = position;
        var LPrevPosition = lPosition;

        csvContent = csvContent + "Items Used: \n\n"
        for (var j = position; j < amountOfResources+prevPostion; j++) {
            csvContent = csvContent + "Item Name: " +resourceUseArray[j].rName + "\n";
            csvContent = csvContent + "Quantity Used: " +resourceUseArray[j].rQuantity + " ";
            csvContent = csvContent + resourceUseArray[j].rQuantifier + "\n";
            csvContent = csvContent + "Cost in this cycle: $" + resourceUseArray[j].rCost + "\n";
            csvContent = csvContent+ "\n";
            costOfCycle = costOfCycle + parseFloat(resourceUseArray[j].rCost);

            position++;
            
        }

        csvContent = csvContent + "Employees Hired for this Cycle: \n\n"
        for (var m = lPosition; m < amountOfEmployees +LPrevPosition; m++) {
            console.log("value of m : " +m);

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
                    resourceUseArray.length=0;
                });
            });
        } else {
            WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
        }
    });
}

//object declaration. Used to store items in resourceUseArray
function resourceUsePerCycle(rName, rQuantity, rQuantifier, rCost) {
    this.rName = rName;
    this.rQuantity = rQuantity;
    this.rQuantifier = rQuantifier;
    this.rCost = rCost;
};

function labourPerCycle(employeeName, employeeCost) {
    this.employeeName = employeeName;
    this.employeeCost = employeeCost;
};

