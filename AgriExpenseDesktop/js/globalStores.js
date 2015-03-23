var dbName = "myPurchases"; //name of database

//names of Object Stores in database
var purchaseObjectStoreName = "purchaseObjectStore";
var cycleObjectStoreName = "cycleObjectStore";
var resourceUseageObjectStoreName = "resourceObjectStore";
var labourObjectStoreName = "labourObjectStore";
var historicalLabourStoreName = "historicalLabourObjectStore";
var otherPurchaseObjectStoreName = "otherPurchaseObjectStore";
var otherFertilizerObjectStoreName = "fertilizerObjectStore";
var otherChemicalObjectStoreName = "chemicalObjectStore";
var otherPlantingMaterialObjectStoreName = "plantingMaterialObjectStore";
var otherSoilAmendmentObjectStoreName = "soilAmendmentObjectStore";
var otherQuantifierObjectStoreName = "otherQuantiferObjectStore";



//hard-coded values that are added to the database on startup
var fertilizerArray = ["12-24-12 Fertlizer", "Ferqidd (10.13.32 + TE)", "Fersan (7.12.40 + 1TEM)", "Flower Plus (9.18.36 + TE)", "Harvest More 10-55-10", "Harvest More 13-0-44", "Harvest More 5-5-45", "Hydro YARA Liva (15.0.15)", "Iron Chelate Powder (FE - EDTA)", "MIRACLE GRO ALL PURPOSE PLANT FOOD", "Magic Grow (7.12.40 + TE HYDROPHONIC)", "Magnesium Sulphate", "NPK 12-12-17", "Plant Booster", "Plant Prod(7-12-27 + TE)", "Scotts Flower and Vegetable Plant Food", "Techni - Grow(7.12.27 + TE)", "UREA 46-0-0"];

var newFertilizerArray = []; //values from the Fertlizer object store in the database are read into this array and then displayed in the select box in the form

var otherPurchaseArray = ["", "Other"];

var chemicalArray = ["Algicides", "Antimicrobials", "Biocides", "Biopesticides", "Fumigants", "Fungicide", "Herbicides", "Insecticides", "Microbial Pesticides", "Miticides", "Molluscicides", "Nematicides", "Ovicides", "Pheromones", "Repellents", "Rodenticides", "Weedicide"];
var newChemicalArray = [];

var soilAmendmentArray = ["Calphos", "Chicken Manure", "Compost", "Cow Manure", "Gypsum", "Horse Manure", "Limestone", "Molasses", "Sharp sand", "Sulphur"];
var newSoilAmendmentArray = [];

var cropArray = ["Anise Seed", "Banana", "Basil", "Bay Leaf", "Beet", "Bhagi", "Bora (Bodi) Bean", "Breadfruit", "Breadnut(Chataigne)"];
var newCropArray = [];

var fertilizerQuantifierArray = ["Bag", "g", "kg", "lb"];
var chemicalQuantifierArray = ["L", "g", "kg", "ml", "oz"];
var plantingMaterialQuantifierArray = ["Heades", "Seeds", "Seedlings", "Slips", "Sticks", "Tubes"];
var soilAmendmentQuantifierArray = ["Bag", "Truck"];

var combinedQuantifierArray = ["Bag", "g", "kg", "lb", "L", "ml", "oz", "Heades", "Seeds", "Seedlings", "Slips", "Sticks", "Tubes", "Bag", "Truck", "Other"];
var totalQuantifierArray = [];


var landTypeArray = ["Acre", "Bed", "Hectre"];
var purchaseTypeArray = ["Chemical", "Fertlizer", "Planting Material", "Soil Amendment", "Other"];

var labourArray = [""];
var paymentArray = ["Hourly", "Daily", "Per Crop Cycle"];