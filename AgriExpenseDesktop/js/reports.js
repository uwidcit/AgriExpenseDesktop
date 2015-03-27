
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
        self = this,
        cycleDataList,
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
                    

                    console.log("value that ought to be pushed : " + selectionCountRU);
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
            selectionCount = cycleListView.selection.count(),
            selectionCommands = document.querySelectorAll(".appBarSelection"),
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");
    };



}

function getTodaysDate() {
    var currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var dateInString = day + "-" + month + "-" + year;

    return dateInString;
}




function generateCsvFile()
{
    var todaysDate = getTodaysDate();
    var csvContent = "";
    
    var position = 0;

    //Text in the file
    for (var i = 0; i < cropCycleNamesArray.length; i++) {
        csvContent = csvContent + " " + cropCycleNamesArray[i].toUpperCase() + " : " + cropCycleCropNamesArray[i].toUpperCase() + "\n";
        var amountOfResources = cropCycleResourceCountArray[i];
        var prevPostion = position;
        console.log("amount of resources "+amountOfResources);
        for (var j = position; j < amountOfResources+prevPostion; j++) {
            csvContent = csvContent + "Item Name: " +resourceUseArray[j].rName + "\n";
            csvContent = csvContent + "Quantity Used: " +resourceUseArray[j].rQuantity + " ";
            csvContent = csvContent + resourceUseArray[j].rQuantifier + "\n";
            csvContent = csvContent + "Cost in this cycle: $" + resourceUseArray[j].rCost + "\n";
            csvContent = csvContent+ "\n";
            position++;
            
        }
        csvContent = csvContent + "\n";
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

function resourceUsePerCycle(rName, rQuantity, rQuantifier, rCost) {
    this.rName = rName;
    this.rQuantity = rQuantity;
    this.rQuantifier = rQuantifier;
    this.rCost = rCost;
};

