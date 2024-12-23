/*
FB.AppEvents.EventNames = {
    "COMPLETED_REGISTRATION": "fb_mobile_complete_registration",
    "VIEWED_CONTENT": "fb_mobile_content_view",
    "SEARCHED": "fb_mobile_search",
    "RATED": "fb_mobile_rate",
    "COMPLETED_TUTORIAL": "fb_mobile_tutorial_completion",
    "ADDED_TO_CART": "fb_mobile_add_to_cart",
    "ADDED_TO_WISHLIST": "fb_mobile_add_to_wishlist",
    "INITIATED_CHECKOUT": "fb_mobile_initiated_checkout",
    "ADDED_PAYMENT_INFO": "fb_mobile_add_payment_info",
    "ACHIEVED_LEVEL": "fb_mobile_level_achieved",
    "UNLOCKED_ACHIEVEMENT": "fb_mobile_achievement_unlocked",
    "PAGE_VIEW": "fb_page_view",
    "SPENT_CREDITS": "fb_mobile_spent_credits"
}




FB.AppEvents.ParameterNames = {
	"APP_USER_ID": "_app_user_id",
	"APP_VERSION": "_appVersion",
	"CURRENCY": "fb_currency",
	"REGISTRATION_METHOD": "fb_registration_method",
	"CONTENT_TYPE": "fb_content_type",
	"CONTENT_ID": "fb_content_id",
	"SEARCH_STRING": "fb_search_string",
	"SUCCESS": "fb_success",
	"MAX_RATING_VALUE": "fb_max_rating_value",
	"PAYMENT_INFO_AVAILABLE": "fb_payment_info_available",
	"NUM_ITEMS": "fb_num_items",
	"LEVEL": "fb_level",
	"DESCRIPTION": "fb_description"
}
*/


function report(eventName, data) {
	if ('undefined' == typeof options) {

	}

	//facebook sdk
	if (true) {
		let pixel_params = {};
		let pixel_event = '';

		let params = {};
		let price = null;

		switch (eventName) {
			case 'fb_mobile_add_to_cart':
				price = data.item_unit_price;

				params['fb_content_id'] = data.item_id;
				params['fb_content_type'] = "product";
				params['fb_currency'] = "USD";


				pixel_event = 'AddToCart';
				pixel_params = {
					content_ids: [data.item_id],
					eventref: '', // or set to empty string
					currency: 'USD', // your currency string value goes here
					content_name: data.product_item_name, // your currency string value goes here
					content_type: "product", // your currency string value goes here
					num_items: 1, // your number of tickets purchased value goes here
					value: data.item_unit_price // your total transaction value goes here
				}
				break;
			case 'fb_mobile_search':

				params['fb_content_type'] = "product";
				params['fb_search_string'] = data.keywords;
				params['fb_success'] = 1;


				pixel_event = 'Search';
				pixel_params = {
					eventref: '', // or set to empty string
					currency: 'USD', // your currency string value goes here
					search_string: data.keywords, // your currency string value goes here
					content_type: "product", // your currency string value goes here
				}
				break;
			case 'fb_mobile_content_view':
				price = data.item_sale_price;

				params['fb_content_id'] = data.item_id;
				params['fb_content_type'] = "product";
				params['fb_currency'] = "USD";

				pixel_event = 'ViewContent';
				pixel_params = {
					content_ids: [data.item_id],
					eventref: '', // or set to empty string
					currency: 'USD', // your currency string value goes here
					content_name: data.product_item_name, // your currency string value goes here
					content_type: "product", // your currency string value goes here
					num_items: 1, // your number of tickets purchased value goes here
					value: data.item_unit_price // your total transaction value goes here
				}
				break;
		}

		console.info(eventName, price, params);
		console.info(pixel_event, pixel_params);

		// #ifdef APP-PLUS
		let jyappEvents = uni.requireNativePlugin("JY-FaceBookAppEvents");
		if (typeof jyappEvents != 'undefined') {
			if (price != null) {
				jyappEvents.jy_standardLogWithAll({
					eventName: eventName,
					valueToSum: price,
					data: params
				}, res => {})
			} else {
				jyappEvents.jy_standardLogWithParams({
					eventName: eventName,
					data: params
				}, res => {})
			}
		}
		// #endif

		// #ifdef H5
		if (typeof FB != 'undefined') {
			FB.AppEvents.logEvent(eventName, price, params);
		}

		if (typeof fbq == "function") {
			fbq('track', pixel_event, pixel_params);
		}
		// #endif
	}



	//不同平台判断
	//uni.report( ...arguments);
}

/**
 * This function will log AddToCart App Event
 * @param {string} contentData
 * @param {string} contentId
 * @param {string} contentType
 * @param {string} currency
 * @param {number} price
 */
/*
function logAddToCartEvent(contentData, contentId, contentType, currency, price) {
    var params = {};
    params[FB.AppEvents.ParameterNames.CONTENT] = contentData;
    params[FB.AppEvents.ParameterNames.CONTENT_ID] = contentId;
    params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = contentType;
    params[FB.AppEvents.ParameterNames.CURRENCY] = currency;
    FB.AppEvents.logEvent(FB.AppEvents.EventNames.ADDED_TO_CART, price, params);
}
*/


export default {
	report: report,
}
