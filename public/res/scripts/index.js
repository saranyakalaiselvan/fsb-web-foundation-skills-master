/*NOTE: All response from API Call will contain the following structure
/*
    {
        "status": "success",=====> will contain either 'success' or 'failure'
        "code": 200,======> status code Ex:404,500,200
        "data": {},====>>requested data
        "error": ""====>>if any errors
    }
*/


/*Global Variables Section*/
var removeSuccessAlert = "<div class='row'><div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>x</button>Successfully Removed</div></div>";
var product_template="<table>";
var responseObj;
var data_object;

//Declare your Global Variables inside this block

/*End of Global Variables*/

// A $(document).ready() block.
$(document).ready(function () {

    //Write any code you want executed in a $(document).ready() block here
});

//Get List of Products from the database
function getProducts() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //JSON.parse is used to convert response String into JSON object
            responseObj = JSON.parse(this.response);
            //User cannot print JSON Object directly, so require JQuery to iterate
            // and show it in HTML
            
            $.each(responseObj, function (i, item) {
                if (i == "data") {
                    data_object = item;
                    $.each(item, function (key, value) {
                        //Right Code to update in the Product Template
                        product_template += "<tr><td> Image: " + value.productImg.filePath.substr(9)
                        +"</td><td><div id="+value.category+"-"+value._id
                        +" style='border: 1px solid teal'>"
                        +"Name: " + value.name 
                        + " Id: " + value._id 
                        + " Price: " + value.price 
                        + " Category: " + value.category 
                        + " Description: " + value.description 
                        + " <button id='remove-product-"+value._id+ "' class='btn btn-danger' onclick=removeProduct('"+value._id+"')>Remove</button><button id='edit-product' class='btn btn-success' onclick=editProduct('"+value._id+"')>Edit</button></div></td></tr>";
                    });
                    product_template+="</table>"
                }
            });
        } else if (this.status == 404) {
            document.getElementById("product-list").innerHTML = "<h4>No Products Available</h4>"
        }
        console.log(product_template);
        document.getElementById("product-list").innerHTML = product_template;
    };
    xhttp.open("GET", "products", true);
    xhttp.send();


    /***
    Write your code for fetching the list of product from the database
    
    Using AJAX call the webservice http://localhost:3000/products in GET method
    It will return an Array of objects as follows
    
        {
            [
                {
                    "_id" : "57b6fabb977a336f514e73ef",
                    "price" : 200,
                    "description" : "Great pictures make all the difference. That’s why there’s the new Moto G Plus, 4th Gen. It gives you a 16 MP camera with laser focus and a whole lot more, so you can say goodbye to blurry photos and missed shots. Instantly unlock your phone using your unique fingerprint as a passcode. Get up to 6 hours of power in just 15 minutes of charging, along with an all-day battery. And get the speed you need now and in the future with a powerful octa-core processor.",
                    "category" : "Smartphones",
                    "name" : "Moto G Plus, 4th Gen (Black, 32 GB)",
                    "productImg" : {
                    "fileName" : "57b6fabb977a336f514e73ef_Product.png",
                    "filePath" : "./public/images/Product/57b6fabb977a336f514e73ef_Product.png",
                    "fileType" : "png"
                },
                {
                    //Next Product and so on
                }
            ]
        }

    Using jQuery
    Iterate through this response array and dynamically create the products list
    using JavaScript DOM and innerHTML.
    ***/
}

//Initial call to populate the Products list the first time the page loads
getProducts();


/*
 
 Write a generic click even capture code block 
 to capture the click events of all the buttons in the HTML page

 If the button is remove
 -----------------------
 Popup an alert message to confirm the delete
 if confirmed
 Call the API
    http://localhost:3000/product/<id>
    with method = DELETE
    replace <id> with the _id in the product object

 Show the success/failure message in a message div with the corresponding color green/red


 If the button is add
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product
    with method=POST
    For this call data should be in following structure
    {
         name:'',
         category:'',
         description:'',
         price:''
    }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the form and set the mode to Add

 
 If the button is edit
 ---------------------
 Change the Form to Edit Mode
 Populate the details of the product in the form
 
 
 If the button is Update
 -----------------------
 Using jQuery Validate the form
 All fields are mandatory.
 Call the API
    http://localhost:3000/product/:id    
    with method=PUT
    replace <id> with the _id in the product object
    For this call data should be in following structure
     {
     name:'',
     category:'',
     description:'',
     price:''
     }

 Show the success/failure messages in a message div with the corresponding color green/red
 Reset the Form
 Set the Form back to Add mode

 if the button is Cancel
 -----------------------
 Reset the form
 Set the mode to Add

 */

/*Remove Product*/
function removeProduct(id) {
    console.log("Remove"+id);
   /*  $.ajax({
        url: "http://localhost:3000/product/"+id,
        type: 'DELETE',
        success: function(data, status, jqXmlHttpRequest){
            console.log("Status: ",status);
        }
    }); */
    //write your code here to remove the product and call when remove button clicked

}

/*Update Product*/
function editProduct(id) {
    console.log(id);
    $(data_object).each(function(key,value){
        
    });
    //write your code here to update the product and call when update button clicked

}

var newData;

function createProduct() {
    var newData =  {
        name: document.getElementById("add-name").value,
        category: document.getElementById("add-category").value,
        description: document.getElementById("add-description").value,
        price: document.getElementById("add-price").value
        };

    console.log(newData);
    $.ajax({
        url: "http://localhost:3000/product",
        type: 'POST',
        data: newData,
        success: function(data, status, jqXmlHttpRequest){
            console.log("Status: ",status);
        }
    });

    //write your code here to create  the product and call when add button clicked

}


/* 
    //Code Block for Drag and Drop Filter

    //Write your code here for making the Category List
    Using jQuery
    From the products list, create a list of unique categories
    Display each category as an individual button, dynamically creating the required HTML Code

    
    //Write your code here for filtering the products list on Drop 
    Using jQuery
    Show the category button with a font-awesome times icon to its right in the filter list
    A category should appear only once in the filter list
    Filter the products list with, products belonging to the selected categories only


    //Write your code to remove a category from the filter list
    Using jQuery
    When the user clicks on the x icon
    Remove the category button from the filter list
    Filter the products list with, products belonging to the selected categories only

 */


//Code block for Free Text Search
$(document).ready(function () {
    $("#searchText").keyup(function () {
        var searchText = $(this).val();

        $("#product-list div").each(function(key, productListDiv){
            if($(productListDiv).text().search(searchText)<0){
                $(productListDiv).hide();
            } else{
                $(productListDiv).show();
            }
        });

        /*
            //Write your code here for the Free Text Search
            When the user types text in the search input box. 
            As he types the text filter the products list
            Matching the following fields
                - Name
                - Description
                - Category
                - Price
            
            The search string maybe present in any one of the fields
            anywhere in the content

         */

    });

});


//Code block for Image Upload

/*
    //Write your Code here for the Image Upload Feature
    Make the product image clickable in the getProducts() method.
    When the user clicks on the product image
    Open the file selector window
    Display the selected image as a preview in the product tile
    
    //Image Upload
    When the user clicks Upload
    Using AJAX
    Update the product image using the following api call
        Call the api
            http://localhost:3000/product/id/ProductImg
            method=PUT
            the data for this call should be as FormData
            eg:
            var formData = new FormData();
            formData.append('file', file, file.name);
    
    Refresh the products list to show the new image
 */
