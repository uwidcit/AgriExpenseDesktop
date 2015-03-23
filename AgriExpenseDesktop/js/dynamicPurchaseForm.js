function addFormDynamic()
{

    var typeSelect = document.getElementById("purchaseTypeSelect");//type of material
    var nameSelect = document.getElementById("selectPurchaseName"); //name of material
    var quantifierSelect = document.getElementById("selectPurchaseQuantifier"); //quantifier of material

    //Put options in select list in alphabetical order by sorting the arrays
    newFertilizerArray.sort();
    newChemicalArray.sort();
    newCropArray.sort();
    newSoilAmendmentArray.sort();
    otherPurchaseArray.sort();
    totalQuantifierArray.sort();

    //remove previous entries from Name select box to put new ones if the Type is changed
    for (var i = nameSelect.options.length - 1; i >= 0; i--) {
        nameSelect.remove(i);
    }

    for (var i = quantifierSelect.options.length - 1; i >= 0; i--) {
        quantifierSelect.remove(i);
    }

    var select = document.getElementById("selectPurchaseName"); //name of material

   
    if (typeSelect.value == "Fertilizer") {

        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        var opt = "(Add New)";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < newFertilizerArray.length; i++) {
            var opt = newFertilizerArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < fertilizerQuantifierArray.length; i++) {
            var opt = fertilizerQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }


    }
    else if (typeSelect.value == "Chemical") {

        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        var opt = "(Add New)";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < newChemicalArray.length; i++) {
            var opt = newChemicalArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < chemicalQuantifierArray.length; i++) {
            var opt = chemicalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Planting Material") {

        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        var opt = "(Add New)";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < newCropArray.length; i++) {
            var opt = newCropArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < plantingMaterialQuantifierArray.length; i++) {
            var opt = plantingMaterialQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Soil Amendment") {
        for (var i = 0; i < newSoilAmendmentArray.length; i++) {
            var opt = newSoilAmendmentArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);

            var opt = "(Add New)";
            var el = document.createElement("option");
            el.textContent = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < soilAmendmentQuantifierArray.length; i++) {
            var opt = soilAmendmentQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }

    else if (typeSelect.value == "Other") {

        //populate Name section with entries from Other object store
        //then if they select "Other" in name: then navigate to addOtherPurchasePage

        //values from the otherPurchaseArray (names)
        for (var i = 0; i < otherPurchaseArray.length; i++) {
            var opt = otherPurchaseArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        //populate quantifier section with values from otherQuantifierObjectStore
        for (var i = 0; i < totalQuantifierArray.length; i++) {
            var opt = totalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
     
    }

}

function navigateOrNot() {

    var nameSelect = document.getElementById("selectPurchaseName");
    var typeSelect = document.getElementById("purchaseTypeSelect");

    if (nameSelect.value == "Other") {
        window.location = "addOtherPurchase.html";
    }
    else if (nameSelect.value == "(Add New)") {
        localStorage.setItem("typeSelected", typeSelect.value);
        window.location = "otherItemTypeKnown.html";
    }
    else if ((nameSelect != "") && (typeSelect == "Other")) {

        //localstorage and pass it on to addOtherPurchases page
        localStorage.setItem("otherNameSelected", nameSelect.value);
        window.location = "addOtherPurchase.html";
    }

}


//Dynamic elements of the "Edit Purchase" form
function editFormDynamic() {

    var typeSelect = document.getElementById("editFormTypeSelect"); //purchase type
    var nameSelect = document.getElementById("editFormPurchaseName"); //purchase Name
    var quantifierSelect = document.getElementById("editFormQuantifier"); //purchase quantifier

    //remove previous entries from Name select box to put new ones if the Type is changed
    for (var i = nameSelect.options.length - 1; i >= 0; i--) {
        nameSelect.remove(i);
    }

    for (var i = quantifierSelect.options.length - 1; i >= 0; i--) {
        quantifierSelect.remove(i);
    }

    var select = document.getElementById("editFormPurchaseName");

    if (typeSelect.value == "Fertilizer") {
        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < fertilizerArray.length; i++) {
            var opt = fertilizerArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }


        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < fertilizerQuantifierArray.length; i++) {
            var opt = fertilizerQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }


    }
    else if (typeSelect.value == "Chemical") {

        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < chemicalArray.length; i++) {
            var opt = chemicalArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < chemicalQuantifierArray.length; i++) {
            var opt = chemicalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Planting Material") {

        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < cropArray.length; i++) {
            var opt = cropArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < plantingMaterialQuantifierArray.length; i++) {
            var opt = plantingMaterialQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Soil Amendment") {
        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        for (var i = 0; i < soilAmendmentArray.length; i++) {
            var opt = soilAmendmentArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < soilAmendmentQuantifierArray.length; i++) {
            var opt = soilAmendmentQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }

    else if (typeSelect.value == "Other") {
        //add blank element to the top
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);

        //values from the otherPurchaseArray (names)

        //REMOVE the option "Other" from the list
        var newArr = otherPurchaseArray.slice(); //copy otherPurchaseArray into newArr
        var index = newArr.indexOf("Other"); //find index of the name "Other"
        newArr.splice(index, 1); //remove "Other" from the array


        for (var i = 0; i < newArr.length; i++) {
            var opt = newArr[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }


        //populate quantifier section with values from otherQuantifierObjectStore

        //add blank element to top of quantifier select box
        var opt = "";
        var el = document.createElement("option");
        el.textContent = opt;
        quantifierSelect.appendChild(el);

        for (var i = 0; i < totalQuantifierArray.length; i++) {
            var opt = totalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }

}