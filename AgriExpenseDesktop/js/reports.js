function generateCsvFile()
{
    var todaysDate = getTodaysDate();
    var data = [["name1", "crop1", "some other info"], ["name2", "crop2", "more info"]];
    var csvContent = "";

    for (var i = 0; i < cropCycleNamesArray.length; i++) {
        csvContent = csvContent + " " + cropCycleNamesArray[i] + ": "+ cropCycleCropNamesArray[i]+  "\n";
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
                  
                });
            });
        } else {
            WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
        }
    });
}


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
            
            //put them in array in global stores

            if (selectionCount > 0) {
                cycleListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var id = item.data.id;
                        var name = item.data.name;
                        var crop = item.data.crop;
                        cropCycleIdsArray.push(id);
                        cropCycleNamesArray.push(name); //insert name  into cropCyclesNamesArray
                        cropCycleCropNamesArray.push(crop);


                        //do for loop in here to get resources used

                    });
                });
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
            selectionCount = cycleListView.selection.count(),
            selectionCommands = document.querySelectorAll(".appBarSelection"),
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");

        if (selectionCount > 0) {
           

            if (selectionCount > 1) {
               
            }

            
        }
        else {
           


        }
    };

   

    this.editToDo = function () {
        var
            anchor = document.querySelector(".toDo"),
            selectionCount = cycleListView.selection.count();

        if (selectionCount === 1) {
            cycleListView.selection.getItems().then(function (items) {
                var
                    item = items[0],
                    editFlyoutElement = document.getElementById("editFlyout");

                var toDo = {
                    id: item.data.id,
                    name: item.data.name,
                    crop: item.data.crop,
                    typeOfLand: item.data.typeOfLand,
                    quantity: item.data.quantity,
                    startDate: item.data.startDate,
                    lvIndex: item.index
                };

                var process = WinJS.Binding.processAll(editFlyoutElement, toDo);

                process.then(function () {
                    editFlyout.show(anchor, "top", "center");
                });
            });
        }
    };



    this.getCropCycleInfo = function (e) {
        var
           anchor = document.querySelector(".toDo"),
           selectionCount = cycleListView.selection.count();

        if (selectionCount === 1) {
            cycleListView.selection.getItems().then(function (items) {
                var
                    item = items[0];

                var toDo = {
                    id: item.data.id,
                    name: item.data.name,
                    lvIndex: item.index
                };

                localStorage.setItem("cropCycleId", item.data.id); //Add Crop Cycle Id to local storage to access later
                localStorage.setItem("cropCycleName", item.data.name);
                localStorage.setItem("cropCycleCrop", item.data.crop);
                localStorage.setItem("cropCycleTypeOfLand", item.data.typeOfLand);
                localStorage.setItem("cropCycleLandQuantity", item.data.quantity);
                localStorage.setItem("cropCycleStartDate", item.data.startDate);

                window.location = 'addPurchases.html'; //navigate to page where they can select from purchases
            });
        }

    }


}

function getTodaysDate() {
    var currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var dateInString = day + "-" + month + "-" + year;

    return dateInString;
}