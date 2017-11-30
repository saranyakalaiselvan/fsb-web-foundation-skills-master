/*Global Variables Section*/
var product_template = "";
var button_categories = "";
var responseObj;
var data_object;
var input_name;
var input_category;
var input_description;
var input_price;
var category_filter = [];
var initial_drop_id = "";

//Declare your Global Variables inside this block


// A $(document).ready() block.
$(document).ready(function () {
    $("#upload-image").hide();

    $(document).on("click", "img[id^='image-div-']", function () {
        var image_id = this.id;
        console.log(image_id);
        $("#upload-image").click();
        $('#upload-image').change(function () {
            readURL(image_id, this);
        })
    });

    var upload_id;
    var image_file;

    function readURL(id, input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#' + id).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
            image_file = input.files[0];
        }
    }

    $(document).on("click", "button[id^='upload-']", function () {
        upload_id = this.id.substr(7);
        uploadImage(upload_id, image_file);
    });

    var removeId;
    /* Function when remove button is clicked */
    $(document).on("click", "button[id^='remove-product-']", function () {
        removeId = this.id.substr(15);
    });

    $(document).on("click", "#confirm-delete", function () {
        removeProduct(removeId);
    });



    var editId;
    /* Function when edit button is clicked */
    $(document).on("click", "button[id^='edit-product-']", function () {
        editId = this.id.substr(13);
        $("#heading-form").html("Edit Product");
        $("#save-form").replaceWith("<button id='update-form' name='success' class='btn btn-success'>Update</button>");
        $.each(data_object, function (key, element) {
            if (element._id == editId) {
                document.getElementById("add-name").value = element.name;
                document.getElementById("add-price").value = element.price;
                document.getElementById("add-category").value = element.category;
                document.getElementById("add-description").value = element.description;
            }
        });

        $(document).on("click", "#update-form", function () {
            if (validateForm()) {
                editProduct(editId);
            }
        });
    });


    /* Function when add product button is clicked */
    $(document).on("click", "#save-form", function () {
        if (validateForm()) {
            createProduct(getInputData());
        }
    });

    $(document).on("click", "#clear-form", function () {
        document.getElementById("product-form").reset();
        $("#heading-form").html("Add Product");
        $("#update-form").replaceWith("<button id='save-form' name='success' class='btn btn-success'>Submit</button>");
    });

    $(document).on("click", "i[id^='close-']", function () {
        var category = this.id.substr(6);
        $("#drop-" + category).remove();
        $("#close-" + category).remove();
        initial_drop_id = "";

        category_filter = category_filter.filter(function (value) {
            return value != category;
        });

        categoryFilter();
    });
});


//Fetch List of Products from the database
function getProducts() {
    $("#product-list").empty();
    $("#button-categories").empty();
    $('#clear-form').click();
    $("#dropped-categories").empty();
    $("#searchText").val('');

    category_filter = [];

    $.ajax({
        url: "products",
        type: 'GET',
    }).done(function (responseObj) {
        cat_array = [];
        $.each(responseObj, function (i, item) {
            if (i == "data") {
                data_object = item;
                $.each(item, function (key, value) {

                    var img_location;

                    if (typeof value.productImg == 'undefined') {
                    img_location = "\images\Product\5a1e4043f61eea1878914508";
                    } else {
                        img_location = value.productImg.filePath.substr(9);
                    }

                    product_template += "<div class='col-lg-12 panel panel-default dashboard_graph' id = 'test-filter'>"
                        + "<div class='col-lg-3'><div>"
                        + "<img id='image-div-" + value._id + "' src=" + img_location + " class = 'img-thumbnail  float-center'></div>"
                        + "<div id='upload'><button class='btn btn-link fa fa-upload' style='padding-left: 45%' id='upload-" + value._id + "'> Upload</button></div></div>"
                        + "<div id='" + value.category + "-" + value._id + "' class='col-lg-8 col-xs-12  pull-right text-justify'>"
                        + "<h4>" + value.name + "</h4>"
                        + "<p>" + value.description + "</p>"
                        + "<p><span class='label label-default'><i id='product-category'>" + value.category + "</i></span></p>"
                        + "<b style='color: brown'>Rs. <i>" + value.price + "</i></b></div>"
                        + "<div class='col-lg-12 panel-footer'><div>"
                        + "<button id='remove-product-" + value._id + "' class='btn btn-danger pull-right' data-toggle='modal' data-target='#myModal'>"
                        + "<span class='glyphicon glyphicon-trash'></span> Remove</button>"
                        + "<button id='edit-product-" + value._id + "' class='btn btn-success pull-right'>"
                        + "<span class='glyphicon glyphicon-edit'></span> Edit</button></div></div></div>"
                    cat_array.push(value.category);
                });
            }
        });

        $.each(jQuery.unique(cat_array), function (i, value) {
            button_categories += "<button id='drag-" + value + "' class='btn btn-success draggable' draggable='true' ondragstart='drag(event)' value = " + value + ">" + value + "</button>";
        });

        document.getElementById("product-list").innerHTML = product_template;
        document.getElementById("button-categories").innerHTML = button_categories;

        product_template = "";
        button_categories = "";
    });


}

//Initial call to populate the Products list the first time the page loads
getProducts();


function validateForm() {
    input_name = document.getElementById("add-name").value;
    input_category = document.getElementById("add-category").value;
    input_description = document.getElementById("add-description").value;
    input_price = document.getElementById("add-price").value;

    if (input_name != "" && input_category != "" && input_description != "" && input_price != "") {
        return true;
    } else {
        $('#alert-banner-form').empty();
        $("#alert-banner-form").html('<div class="alert alert-danger alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Please fill all fields</div>');

        $('#alert-banner-form').slideUp(1000, function () {
            $(this).empty().show();
        });

        return false;
    }
}
function getInputData() {

    return {
        name: input_name,
        category: input_category,
        description: input_description,
        price: input_price
    }
}

/*Remove Product*/
function removeProduct(id) {
    console.log("Remove " + id);
    $.ajax({
        url: "product/" + id,
        type: 'DELETE',
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function () {
            $('#alert-banner').empty();
            $("#alert-banner").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Deleted Successfully</div>');

            $('#alert-banner').slideUp(1000, function () {
                $(this).empty().show();
            });

            getProducts();
        }
    });
}

/*Update Product*/
function editProduct(id) {
    $.ajax({
        url: "product/" + id,
        type: 'PUT',
        dataType: 'json',
        data: getInputData(),
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function (data) {
            $('#alert-banner-form').empty();
            $("#alert-banner-form").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Updated Successfully</div>');

            $('#alert-banner-form').slideUp(1000, function () {
                $(this).empty().show();
            });
            getProducts();
        }
    });

}

function createProduct(newData) {

    $.ajax({
        url: "product",
        type: 'POST',
        data: newData,
        success: function (data, status, jqXmlHttpRequest) {
            console.log("Status: ", status);
        },
        complete: function () {
            $("#alert-banner-form").empty();
            $("#alert-banner-form").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Product Successfully Saved</div>');

            $('#alert-banner-form').slideUp(1000, function () {
                $(this).empty().show();
            });

            getProducts();
        }
    });


}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    $("#searchText").val('');
    var data = ev.dataTransfer.getData("text");
    if (initial_drop_id != data) {
        initial_drop_id = data;
        var categoryName = $('#' + data).val();
        category_filter.push(categoryName);

        var button_element = document.createElement('button');
        button_element.type = "button";
        button_element.value = categoryName;
        button_element.className = "btn btn-success";
        button_element.innerHTML = categoryName;
        button_element.id = "drop-" + categoryName;

        var spanElement = document.createElement('i');
        spanElement.className = "fa fa-times-circle";
        spanElement.id = "close-" + categoryName;
        spanElement.style.color = "#a50b0b";
        spanElement.setAttribute("aria-hidden", "true");
        spanElement.appendChild(document.createTextNode("     "))

        ev.target.appendChild(button_element);
        ev.target.appendChild(spanElement);

        categoryFilter();

    }

}

//Code block for Free Text Search
$(document).ready(function () {
    $("#searchText").keyup(function () {
        $("i[id^='close-']").click();
        var searchText = $(this).val().toUpperCase();
        $("#product-list #test-filter").each(function (key, productListDiv) {

            if ($(productListDiv).text().toUpperCase().search(searchText) < 0) {
                $(productListDiv).hide();
            } else {
                $(productListDiv).show();
            }
        });
    });
});


function categoryFilter() {
    $.each(category_filter, function (i, category_name) {

        $("#product-list #test-filter").each(function (key, productListDiv) {
            if ($(productListDiv).text().search(category_name) < 0) {
                $(productListDiv).hide();
            }
        });
    });

    $.each(category_filter, function (i, category_name) {
        $("#product-list #test-filter").each(function (key, productListDiv) {
            if ($(productListDiv).text().search(category_name) > 0) {
                $(productListDiv).show();
            }
        });
    });

    if (category_filter.length == 0) {
        $("#product-list #test-filter").show();
    }
}


//Code block for Image Upload
function uploadImage(id, file) {
    var formData = new FormData();
    formData.append('file', file);
    console.log(formData.get);
    $.ajax({
        url: "product/" + id + "/ProductImg",
        type: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data, status, jqXmlHttpRequest) {
            $('#alert-banner').empty();
            $("#alert-banner").html('<div class="alert alert-success alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Image Uploaded Successfully</div>');

            $('#alert-banner').slideUp(1000, function () {
                $(this).empty().show();
            });

            getProducts();
        }
    });
}


