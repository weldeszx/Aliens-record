// alert("Loading")
// ---------------------------------
//  Create and run function to clean up data
function cleanUpData(){
    for(i=0;i<dataSet.length; i++){
        // set variables
        var current = dataSet[i];
        
        // clean up abbrs and add full text of country
        var countryAbbrLower = current.country;
        var countryAbbrUpper = countryAbbrLower.toUpperCase();
        var countryFullName = isoCountries[countryAbbrUpper];
        dataSet[i].countryName = countryFullName;
        dataSet[i].country = countryAbbrUpper;

        // attempt to fix () messiness
        var cityLower = current.city;
        var firstParan = cityLower.indexOf("(")
        var closeParan = cityLower.indexOf(")")
        while (firstParan > -1){
            if (closeParan > -1){
                cityLower = cityLower.slice(0, firstParan) + cityLower.slice(closeParan + 1)
                // console.log(cityLower)
                firstParan = cityLower.indexOf("(")
                closeParan = cityLower.indexOf(")")
            } else {
                cityLower.replace("(", " ")
                // console.log(cityLower)
            }
        }
        // capitalize each word in city
        var cityLowerArray = cityLower.split(" ");
        var cityUpperArray = []
       for (j=0; j<cityLowerArray.length; j++){
            var capitalizedWord = cityLowerArray[j].slice(0,1).toUpperCase() + cityLowerArray[j].slice(1);
            cityUpperArray.push(capitalizedWord)
       }
        var cityUpper = cityUpperArray.join(" ")
        // console.log(cityUpper)
        dataSet[i].city = cityUpper.trim()
    //    console.log(dataSet[i])

    //  Capitalize State Abbr and Add Full State name 
    var stateAbbrLower = current.state;
    var stateAbbrUpper = stateAbbrLower.toUpperCase();
    if ((stateAbbr[stateAbbrUpper]) && (dataSet[i].country == "US")){
        var stateFullName = stateAbbr[stateAbbrUpper];
        }
    else if ((canadian_prov[stateAbbrUpper] && (dataSet[i].country == "CA"))){
        var stateFullName = canadian_prov[stateAbbrUpper];          
        }
    else if ((australian_prov[stateAbbrUpper] && (dataSet[i].country == "AU"))){
        var stateFullName = australian_prov[stateAbbrUpper];          
        }
    else {
        var stateFullName = "N/A"
    }
    dataSet[i].state = stateAbbrUpper;
    dataSet[i].stateName = stateFullName;
    
    //  clean shape name
    var shapeName = current.shape
    var shapeUpper = shapeName.slice(0,1).toUpperCase() + shapeName.slice(1);
    dataSet[i].shape = shapeUpper;
    // console.log(dataSet[i])

    //  fix dates to be MM/DD/YYYY
    var dateRaw = current.datetime;
    // console.log(dateRaw)
    var dateArray = dateRaw.split("/");
    for(var d=0; d<3; d++){
        if (dateArray[d].length == 1){
           dateArray[d] = "0" + dateArray[d];
        }
    }
    var newDate = dateArray.join("/");
    dataSet[i].datetime = newDate;
    

    // console.log(dataSet[i]);
}
}
 ;
           

cleanUpData();





// Get Info for Clean Dropdown Menus & Searchability

// function to create clean lists for choices
function getListForDropdown(thing){
    // console.log(thing);
    var results = dataSet.map(a => a[thing]);
    // console.log(results);

    var unique_results = [];

    for(var i = 0; i< results.length; i++){
        var current = results[i];
        var flag = unique_results.indexOf(current);
        if (flag < 0){
            unique_results.push(current)
        }
    }
    unique_results.push("All")
    return unique_results.sort()
};

// uses function to save vars as lists for choices
var unique_countries = getListForDropdown("countryName");
var unique_shapes = getListForDropdown("shape");

// // --------------------------------
// Create dropdown and multi select
var $countryDropDown = document.querySelector("#country");
var $shapeSelect = document.querySelector("#shape");

function createOptions(uniqueList, formObject){

    for(i=0; i<uniqueList.length; i++){
    
    // console.log(uniqueList[i])
    var $obj = document.createElement("option");
    $obj.innerHTML = uniqueList[i];
    formObject.appendChild($obj);

}
};


createOptions(unique_countries, $countryDropDown);
createOptions(unique_shapes, $shapeSelect);

// ------------------------------------ End of Create Options Section ----------------------------//





// Render Table



// make column Headers
var $table = document.querySelector("table")
// all objects  have 7 entries
// var columnHeaders = ["Date", "City", "State", "Country", "Shape", "Duration of Sighting", "Observer's Statement"]
function makeColumnHeaders(){
    var columnHeaders = ["Date", "City", "State", "Country", "Shape", "Duration of Sighting", "Observer's Statement"]
    var $thead = $table.createTHead();
    var $row = $thead.insertRow();
    for(var i=0;i<columnHeaders.length;i++){
        var $cell = document.createElement("th");
        $cell.innerHTML = columnHeaders[i];
        $row.appendChild($cell)
    
        
    }
}


makeColumnHeaders()
var $tbody = $table.createTBody()
// End of column Headers



// Render Table

var filteredData = dataSet;

var maxEndNum = filteredData.length;

var startNum = 0;
var endNum = 50;

var pageNum = 0;

function renderTable(numRecordsStart, numRecordsStop){
    
   $tbody.innerHTML = ""

    maxEndNum = filteredData.length;

    // for (var i=0;i<filteredData.length;i++){
    for (var i=numRecordsStart;i<numRecordsStop;i++){
        var $dataRow = $tbody.insertRow()
        var rowData = filteredData[i];
        var columns = [rowData.datetime, rowData.city, rowData.state, rowData.country, rowData.shape, rowData.durationMinutes, rowData.comments]
        // console.log(rowData)
        for(var j=0; j<columns.length; j++){
            var $dataCell = $dataRow.insertCell(j);
            $dataCell.innerHTML = columns[j];
                if (columns[j] == rowData.columns){
                    $dataCell.style.wordWrap = "break-word";
                    $dataCell.style.minWidth = "40%";
                    $dataCell.style.maxWidth = "40%";
                }
                else {
                    $dataCell.style.wordWrap = "break-word";
                    $dataCell.style.minWidth = "10%";
                    $dataCell.style.maxWidth = "10%";
                

            }
         }
    }
   
}
renderTable(startNum, endNum)


// Filter Functionality

// search inputs 
var $dateInput = document.querySelector("#date");
var $cityInput = document.querySelector("#city");
var $stateInput = document.querySelector("#state");
var $countryInput = document.querySelector("#country");
var $shapeInput = document.querySelector("#shape");

// Search button
var $searchbtn = document.querySelector("button");

// buttons for pagination
$nextBtn = document.querySelector("#next")
$previousBtn = document.querySelector("#previous")


// event listener for search button
$searchbtn.addEventListener("click", handleSearch);




// filter data on click
function handleSearch(event){

event.preventDefault();

// create vriables for inputs - tranforming when needed and conditionally
var searchDate = $dateInput.value.toString();
if (searchDate){
    var dateArray = searchDate.split("-");
    newDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0]
    searchDate = newDate
}
console.log("date:" + searchDate)
var searchCity = $cityInput.value.replace(/[^0-9a-z]/gi, '').trim().toLowerCase();
console.log("city: " + searchCity)
var searchState = $stateInput.value.replace(/[^0-9a-z]/gi, '').trim().toLowerCase();
console.log("state: " + searchState)
var searchCountry = $countryInput.value.trim().toLowerCase();
if (searchCountry === "all"){
    searchCountry = ""
}
console.log("Country: " + searchCountry)
var searchShape = $shapeInput.value.trim().toLowerCase();
if (searchShape == "all"){
    searchShape = ""
} 
console.log("Shape: " + searchShape)


// create filtered data set
filteredData = dataSet.filter(function(record) {
    var dateMatch = record.datetime.substring(0, searchDate.length)

    var cityMatch = record.city.replace(/[^0-9a-z]/gi, '').substring(0, searchCity.length).toLowerCase().trim();
    var cityFlag = cityMatch.indexOf(searchCity) ///allows for partial match

    var stateMatchFull = record.stateName.replace(/[^0-9a-z]/gi, '').substring(0, searchState.length).toLowerCase().trim();
    var stateMatchAbbr = record.state.replace(/[^0-9a-z]/gi, '').substring(0, searchState.length).toLowerCase().trim();
    var stateFullFlag = stateMatchFull.indexOf(searchState) /// allows for partial match

    var countryMatch = record.countryName.substring(0, searchCountry.length).toLowerCase().trim();

    var shapeMatch = record.shape.substring(0, searchShape.length).toLowerCase().trim();

    if (dateMatch === searchDate && 
        ((cityMatch === searchCity) || (cityFlag > -1)) &&
        ((stateMatchAbbr === searchState) || (stateMatchFull === searchState) || (stateFullFlag > -1)) &&
        countryMatch === searchCountry &&
        shapeMatch === searchShape)
    {
    return true;
    }
    return false;
  });

  startNum = 0;
  endNum = 50;
  
  var maxEndNum = filteredData.length;
  
      if (maxEndNum < endNum){
          endNum = maxEndNum
          $nextBtn.classList.add('disabled')
      }

renderTable(startNum, endNum);

$dateInput.value = ""
$cityInput.value = ""
$stateInput.value = ""
$countryInput.selectedIndex = 'All'
$shapeInput.selectedIndex = 'All'

$previousBtn.className ='previous disabled';
$previousBtn.innerHTML = "<a href=''>Previous</a>";

$nextBtn.className = 'next';
$nextBtn.innerHTML = "<a href=''>Next 50 Results</a>"
}

// Pagination Handling


// $previousBtn = document.querySelector()
var pageNum = 0;

$nextBtn.addEventListener("click", function(event){
    event.preventDefault();
    console.log($nextBtn.className);

    if ($nextBtn.className == "next"){

    pageNum += 1;

    startNum += 50;
    endNum += 50;
    


    if (maxEndNum < endNum){
        endNum = maxEndNum
        $nextBtn.classList.add('disabled');

        $nextBtn.innerHTML = "<a href=''>End of Results</a>";
    }
    renderTable(startNum, endNum);

    if (pageNum == 1){
        $previousBtn.classList.remove('disabled');
        $previousBtn.innerHTML = "<a href=''>Previous 50 Results</a>"
    }
}
});

$previousBtn.addEventListener("click", function(event){

    event.preventDefault();

    if (pageNum>0){

        pageNum -= 1
        
        if (maxEndNum == endNum){
            $nextBtn.classList.remove('disabled');
            
                $nextBtn.innerHTML = "<a href=''>Next 50 Results</a>";
        }
        startNum -= 50;
        endNum -= 50;

        if(pageNum == 0){
            $previousBtn.classList.add('disabled');
            $previousBtn.innerHTML = "<a href=''>Previous</a>"
        }

        renderTable(startNum, endNum);

    }
})

