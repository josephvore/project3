// requires API_ENDPOINT_URL_STR in window scope

var
	$brand_select = $("[data-role='brand_select']");
	$filter_type = $("[data-role='filter_type']"),
	$phone_info = $("[data-role='phone_info']");

function g_ajaxer(url_str, params, ok_cb, fail_cb){
	$.ajax({
		url: url_str,
		type: "POST",
		data: JSON.stringify(params),
		crossDomain: true,
		contentType: "application/json",
		dataType: "json",
		success: ok_cb,
		error: fail_cb,
		timeout: 3000
	});
}
function clearFilter(){
	$brand_select.val("All");
	$phone_info.html("");
	$phone_info
		.attr("data-showing", "not_showing")
	$filter_type.text("Showing all phones");
	//do new search
	postRequest("all");
}
function handleFailure(fe){
	console.log("FAIL");
	if(fe.status === 405){
		$filter_type.text("No API to call");
	}else{
		$filter_type.text("Failed due to CORS");
	}
}
function handleSuccess(data_arr){
	var 
		filter_str = $brand_select.val();
	if(data_arr.length === 0){
		$filter_type.text("No " + filter_str.toLowerCase() + " phones found");
		$phone_info
			.attr("data-showing", "not_showing")
	}
	showPhones(data_arr);
}
function postRequest(brand_str){
	showSearching();
	var params = {
		brand_str: brand_str
	};
	g_ajaxer(window.API_ENDPOINT_URL_STR, params, handleSuccess, handleFailure);
}
function showPhones(data_arr){
	var 
		html_str = '',
		model_str = "",
		description_str = "",
		price_str = "",
		img_str = "",
		brand_str = "",
		filter_str = $brand_select.val();
		html_str = '\
		<div class="container">\
			<div class="row">';
				
	for(var i_int = 0; i_int < data_arr.length; i_int += 1){
		model_str = data_arr[i_int].model.S || data_arr[i_int].model;
		price_str = data_arr[i_int].price.S || data_arr[i_int].price;
		description_str = data_arr[i_int].description.S || data_arr[i_int].description;
		img_str = data_arr[i_int].img_name.S || data_arr[i_int].img_name;
		brand_str = data_arr[i_int].brand.S || data_arr[i_int].brand;
		html_str += '<div class="col-md-6">';
		html_str += '\
			<div class="box">\
				<div class="img-box">\
					<img class="mt-3" src="redial-images/' + img_str.toLowerCase() + '.jpg" alt="this is a picture of ' +  model_str + '">\
					<p class="pl-4"><span class="h2 mt-4">' + model_str  + '</span><br><br><b>Brand: </b>' + brand_str  + '<br><b>Price: </b>$' + price_str + '<br><b>Description: </b>' + description_str + '</p>\
				</div>\
				<div class="new">\
					<span class="mb-1"><i class="bi bi-cart-plus fa-lg"></i></span>\
				</div>\
			</div>';
		html_str += '</div>';
	}

	$filter_type.text("Showing " + filter_str.toLowerCase() + " phones");
	$phone_info
		.attr("data-showing", "showing")
		.append(html_str);
	if(data_arr.length === 0){
		$phone_info.html('<h6>No phones found!</h6>');
	}

}
function showSearching(){
	var 
		filter_str = $brand_select.val();
	$filter_type.text("Searching database for " + filter_str.toLowerCase() + " phones...");
	$phone_info.attr("data-showing", "not_showing").html("");
}
function submitbrand(se){
	se.preventDefault();
	//validate todo
	postRequest($brand_select.val());
}

// handlers
$(document).on("change", "[data-action='choose_brand']", submitbrand);


//onm load
postRequest("All");