var myDatabase = myDatabase || {};
    "use strict";
    
    myDatabase.data = (function () {
        var indexedDB = window.indexedDB;

        var init = function (success) {
            var request = indexedDB.open(dbName, 30); //open database with name dbName (stored in global stores) and version 1

            request.onsuccess = function () { //database successfully opened
                myDatabase.data.db = request.result;
                success();
            };

            request.onerror = function (event) { //database did not open
                console.log(event);
            };

            request.onblocked = function (event) {
                console.log(event);
            };

            request.onupgradeneeded = function (e) { //runs only when a new instance of the db is created
                var db = e.target.result;

               //This deletion section is for testing purposes ONLY. It must be removed in the final product.
                db.deleteObjectStore(purchaseObjectStoreName);
                db.deleteObjectStore(cycleObjectStoreName);
                db.deleteObjectStore(resourceUseageObjectStoreName);
                db.deleteObjectStore(labourObjectStoreName);
                db.deleteObjectStore(historicalLabourStoreName);
                db.deleteObjectStore(otherPurchaseObjectStoreName);
                db.deleteObjectStore(otherFertilizerObjectStoreName);
                db.deleteObjectStore(otherChemicalObjectStoreName);
                db.deleteObjectStore(otherPlantingMaterialObjectStoreName);
                db.deleteObjectStore(otherSoilAmendmentObjectStoreName);
                db.deleteObjectStore(otherQuantifierObjectStoreName);
                db.deleteObjectStore(harvestObjectStoreName);  
                
                //create all object stores
                var purchaseStore = db.createObjectStore(purchaseObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var cycleStore = db.createObjectStore(cycleObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var resourceUseStore = db.createObjectStore(resourceUseageObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var labourStore = db.createObjectStore(labourObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var historicalLabourStore = db.createObjectStore(historicalLabourStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherPurchaseStore = db.createObjectStore(otherPurchaseObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherFertlizerStore = db.createObjectStore(otherFertilizerObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherChemicalStore = db.createObjectStore(otherChemicalObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherPlantingMaterialStore = db.createObjectStore(otherPlantingMaterialObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherSoilAmendmentStore = db.createObjectStore(otherSoilAmendmentObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherQuantifierStore = db.createObjectStore(otherQuantifierObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var harvestStore = db.createObjectStore(harvestObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                //create indexes on object stores
                cycleStore.createIndex("name", "name", {
                    unique: false
                }); 

                purchaseStore.createIndex("name", "name", {
                    unique: false
                });

                resourceUseStore.createIndex("name", "name", {
                    unique: false
                });

                labourStore.createIndex("name", "name", {
                    unique: false
                });

                historicalLabourStore.createIndex("name", "name", {
                    unique: false
                });

                otherPurchaseStore.createIndex("name", "name", {
                    unique: false
                });

                otherFertlizerStore.createIndex("name", "name", {
                    unique: false
                });

                otherChemicalStore.createIndex("name", "name", {
                    unique: false
                });

                otherPlantingMaterialStore.createIndex("name", "name", {
                    unique: false
                });

                otherSoilAmendmentStore.createIndex("name", "name", {
                    unique: false
                });

                otherQuantifierStore.createIndex("name", "name", {
                    unique: false
                });

                harvestStore.createIndex("name", "name", {
                    unique: false
                });


                //read from the various hard-coded arrays and insert into database on first startup
                for (var i = 0; i < fertilizerArray.length; i++) {
                    var toDo = {
                        type: "Fertilizer",
                        name: fertilizerArray[i]
                    };

                    otherFertlizerStore.add(toDo);
                }

                for (var i = 0; i < chemicalArray.length; i++) {
                    var toDo = {
                        type: "Chemical",
                        name: chemicalArray[i]
                    };

                    otherChemicalStore.add(toDo);
                }

                for (var i = 0; i < cropArray.length; i++) {
                    var toDo = {
                        type: "Planting Material",
                        name: cropArray[i]
                    };

                    otherPlantingMaterialStore.add(toDo);
                }

                for (var i = 0; i < soilAmendmentArray.length; i++) {
                    var toDo = {
                        type: "Soil Amendment",
                        name: soilAmendmentArray[i]
                    };

                    otherSoilAmendmentStore.add(toDo);
                }

                //read from the quantifier array and add to the database on startup
                for (var i = 0; i < combinedQuantifierArray.length; i++) {
                    var toDo = {
                        name: combinedQuantifierArray[i]
                    };
                    otherQuantifierStore.add(toDo);
                }

            };
        };

        return {
            init: init
        };

    })();

    

    myDatabase.purchaseList = (function () {


        //get items from an object store and return it as a list
        var getList = function (oStoreName, success) {       
                var
                    list = [],
                    transaction = myDatabase.data.db.transaction(oStoreName),
                    store = transaction.objectStore(oStoreName);

                store.openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (cursor.value.amountRemaining != '0') {  //check if the quantity remaining (in purchases) is more than 0, then add to the list
                            list.push(cursor.value); //add to list
                        }
                        cursor.continue();
                    }
                    else {
                        success(list);
                };
            }
        };

        //used in addPurchases.js to get list of fertilizres, list of chemicals etc.
        var getListByItemType = function (oStoreName, itemType, cropName, success) {
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                //if the farmer is adding more Planting Material, filter by crop also
                if (itemType == 'Planting Material') {

                    if (cursor) {
                        if ((cursor.value.amountRemaining != '0') && (cursor.value.type == itemType) && (cursor.value.name == cropName)) {  //check if the quantity remaining (in purchases) is more than 0, then add to the list
                            list.push(cursor.value); //add to list
                        }
                        cursor.continue();
                    }
                    else {
                        success(list);
                    };
                }

                else { //just filter by type for all other types except Planting Material (which is done above)
                    if (cursor) {
                        if ((cursor.value.amountRemaining != '0') && (cursor.value.type == itemType)) {  //check if the quantity remaining (in purchases) is more than 0, then add to the list
                            list.push(cursor.value); //add to list
                        }
                        cursor.continue();
                    }
                    else {
                        success(list);
                    };
                }
            }
        };

        //used in deleteItemUsed.js to get list of fertilizres, list of chemicals etc.
        var getListByItemTypeAndCycle = function (oStoreName, itemType, cropCycleId, success) {
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;
            
                if (cursor) {
                  if ((cursor.value.resourceType == itemType) && (cropCycleId == cursor.value.cropCycleID)) { //filter by certain criteria
                       list.push(cursor.value); //add to list
                   }
                    cursor.continue();
                }
                else {
                    success(list);
                };

            }

        };

        //used in generating reports - gets the information about a particualr purchase. Fields we are interested in are: quantity and cost
        var getDetailsFromPurchase = function (oStoreName, purchaseID, success) {
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if (cursor.value.id == purchaseID) {  //check if the purchaseID in the list of purchases is the one we're looking for
                        list.push(cursor.value); //add to list

                        //add this stuff to local storage
                        localStorage.setItem("amountPurchased", cursor.value.quantity);
                        localStorage.setItem("costOfPurchase", cursor.value.cost);
                        
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                };

            }

        };


        //get items from the cropCycle object store and filter by type and crop cycle id
        var getCycleList = function (oStoreName, materialType, cropCyId, success) {
         
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if ((cursor.value.cropCycleID == cropCyId) && (cursor.value.resourceType == materialType)) {  //filter by cropcycle id
                        list.push(cursor.value); //add to list
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                    
                };

            }
        };

        //Get data associated with each cycle and return it as a list. Used in generating the reports
        //also used for calculating total cost for each cycle
        var getDataForEachCycle = function (oStoreName, cropCyId, success) {

            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if ((cursor.value.cropCycleID == cropCyId)) {  //filter by cropcycle id
                        list.push(cursor.value); //add item to list
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                };

            }
        };

        //used in getting information for the reports generated
        var getLabourForEachCycle = function (oStoreName, cropCyId, success) {

            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if ((cursor.value.cycleID == cropCyId)) {  //filter by cropcycle id
                        list.push(cursor.value); //add item to list
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                };

            }
        };

        var getHarvestForEachCycle = function (oStoreName, cropCyId, success) {

            //initialise harvestAlreadyPresent and harvestIdOfEntry variable
            localStorage.setItem("harvestAlreadyPresent", "no");
            localStorage.setItem("harvestIdOfEntry", 0);
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if ((cursor.value.cropCycleId == cropCyId)) {  //filter by cropcycle id
                        //add something to local storage to check if an entry already exists
                        localStorage.setItem("harvestAlreadyPresent", "yes");
                        localStorage.setItem("harvestIdOfEntry", cursor.value.id);
                        list.push(cursor.value); //add item to list
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                };

            }
        };

       

        //search for an item in an object store in the database
        var get = function (oStoreName, key, success) { 
            var
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName),
                request = store.get(oStoreName, key);

            request.onsuccess = function (e) {
                success(e.target.result);
            };
        };


        //add an item to an obejct store in the database
        var add = function (toDo, oStoreName, success) {
            if (oStoreName == purchaseObjectStoreName) {
               
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: toDo.type,
                        name: toDo.name,
                        quantifier: toDo.quantifier,
                        quantity: toDo.quantity,
                        amountRemaining: toDo.amountRemaining,
                        initialAmount: toDo.initialAmount,
                        cost: toDo.cost
                    });
            }
            else if (oStoreName == cycleObjectStoreName) {
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        name: toDo.name,
                        crop: toDo.crop,
                        typeOfLand: toDo.typeOfLand,
                        quantity: toDo.quantity,
                        startDate: toDo.startDate
                    });
            }

            else if (oStoreName == resourceUseageObjectStoreName) {
                
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        purchaseID: toDo.purchaseID,
                        resourceName: toDo.resourceName,
                        cropCycleID: toDo.cropCycleID,
                        resourceType: toDo.resourceType,
                        amountToAdd: toDo.amountToAdd,
                        quantifier: toDo.quantifier,
                        cost: toDo.cost,
                        useCost: toDo.useCost,
                        datePurchased: toDo.datePurchased
                    });
            }

            else if (oStoreName == labourObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        personName: toDo.personName,
                        paymentPlan: toDo.paymentPlan,
                        time: toDo.time,
                        cost: toDo.cost,
                        cycleID: toDo.cycleID
                    });
            }

            else if (oStoreName == historicalLabourStoreName) {
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        name: toDo.name
                    });
            }

            else if (oStoreName == otherPurchaseObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: toDo.type,
                        name: toDo.name,
                        quantifier: toDo.quantifier,
                        quantity: toDo.quantity,
                        cost: toDo.cost,
                        amountRemaining: toDo.amountRemaining
                    });
            }

            else if (oStoreName == otherFertilizerObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: "Fertilizer",
                        name: toDo.name
                    });
            }

            else if (oStoreName == otherChemicalObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Chemical",
                       name: toDo.name
                   });
            }

            else if (oStoreName == otherPlantingMaterialObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Planting Material",
                       name: toDo.name
                   });
            }

            else if (oStoreName == otherSoilAmendmentObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Soil Amendment",
                       name: toDo.name
                   });
            }

            else if (oStoreName == otherQuantifierObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       name: toDo.name //quantifier name
                   });
            }

            else if (oStoreName == harvestObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       harvestType: toDo.harvestType,
                       harvestAmount: toDo.harvestAmount,
                       costPerCrop: toDo.costPerCrop,
                       harvestDate: toDo.harvestDate,
                       profit: toDo.profit,
                       cropCycleId: toDo.cropCycleId
                   });
            }
               
            
            request.onsuccess = function (e) {
                toDo.id = e.target.result;
                success(toDo);
            };
        };


        //edit an item in an objectstore in the database
        var update = function (toDo, oStoreName, success) {

            if (oStoreName == purchaseObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(purchaseObjectStoreName, "readwrite"),
                  store = transaction.objectStore(purchaseObjectStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      type: toDo.type,
                      name: toDo.name,
                      quantifier: toDo.quantifier,
                      quantity: toDo.quantity,
                      amountRemaining: toDo.amountRemaining,
                      cost: toDo.cost
              });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            else if (oStoreName == cycleObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(cycleObjectStoreName, "readwrite"),
                  store = transaction.objectStore(cycleObjectStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      name: toDo.name,
                      crop: toDo.crop,
                      typeOfLand: toDo.typeOfLand,
                      quantity: toDo.quantity,
                      startDate: toDo.startDate
              });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            else if (oStoreName == otherPurchaseObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                  store = transaction.objectStore(oStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      name: toDo.name,
                      quantifier: toDo.quantifier,
                      quantity: toDo.quantity,
                      cost: toDo.cost
                  });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            else if (oStoreName == harvestObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                  store = transaction.objectStore(oStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      harvestType: toDo.harvestType,
                      harvestAmount: toDo.harvestAmount,
                      costPerCrop: toDo.costPerCrop,
                      harvestDate: toDo.harvestDate,
                      profit: toDo.profit,
                      cropCycleId: toDo.cropCycleId
                  });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            //edit resources in resources.html
            else if ((oStoreName == otherFertilizerObjectStoreName) || (oStoreName == otherChemicalObjectStoreName) ||
                (oStoreName == otherPlantingMaterialObjectStoreName) || (oStoreName == otherSoilAmendmentObjectStoreName)) {
                var
                  transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                  store = transaction.objectStore(oStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      name: toDo.name
                  });

                request.onsuccess = function () {
                    success(toDo);
                };
            }



          
        };


        //delete an item in an object store in the database
        var remove = function (key, oStoreName, success) {
            var
                transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                store = transaction.objectStore(oStoreName),
                request = store.delete(key);

            request.onsuccess = function () {
                success();
            };
        };

        return {
            get: get,
            getList: getList,
            getCycleList: getCycleList,
            getDataForEachCycle: getDataForEachCycle,
            getLabourForEachCycle: getLabourForEachCycle,
            getHarvestForEachCycle: getHarvestForEachCycle,
            getDetailsFromPurchase: getDetailsFromPurchase,
            getListByItemType: getListByItemType,
            getListByItemTypeAndCycle: getListByItemTypeAndCycle,
            add: add,
            update: update,
            remove: remove
        };

    })();