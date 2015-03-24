

function populateList() {

    newFertilizerArray.sort();
    newChemicalArray.sort();
    newCropArray.sort();
    newSoilAmendmentArray.sort();
    otherPurchaseArray.sort();
    totalQuantifierArray.sort();

    var quantifierSelect = document.getElementById("selectOtherPurchaseQuantifier");

    //add blank element at the top
    var opt = "";
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    quantifierSelect.appendChild(el);

    //add option "Add New"
    var opt = "(Add New)";
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    quantifierSelect.appendChild(el);

    //populate select list with elements from totalQuantifierArray
    for (var i = 0; i < totalQuantifierArray.length; i++) {
        var opt = totalQuantifierArray[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        quantifierSelect.appendChild(el);
    }

}

//if user selects "Add New" navigate to newQuantifier.html page
function navigateOrNot() {

    newFertilizerArray.sort();
    newChemicalArray.sort();
    newCropArray.sort();
    newSoilAmendmentArray.sort();
    otherPurchaseArray.sort();
    totalQuantifierArray.sort();

    var quantifierSelect = document.getElementById("selectOtherPurchaseQuantifier");
    if (quantifierSelect.value == "(Add New)") {
        window.location = "newQuantifier.html";
    }
}