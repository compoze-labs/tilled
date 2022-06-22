/* tslint:disable */
/* eslint-disable */
/**
 * Tilled API
 * The Tilled API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.  You can use the Tilled API in test mode, which does not affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode. Before your account is activated you will only be able to interact with test mode.  Authentication uses a standard web token schema.  **Notice**: The Tilled API treats HTTP status `401` to mean `Unauthenticated` and not the HTTP standard name of `Unauthorized`. Requests made for materials the requester does not have permission to access, the API will respond with `403: Forbidden`.  # Authentication  The tilled API uses API keys to authenticate requests. You can view and manage your API keys in the Tilled Dashboard.  Test mode secret keys have the prefix sk*test* and live mode secret keys have the prefix sk*live*. Alternatively, you can use restricted API keys for granular permissions.  Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.  Authentication to the API is performed via custom HTTP Header `tilled-api-key`. Provide your API key as the value.  All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.  <!-- ReDoc-Inject: <security-definitions> -->  # Errors  Tilled uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the `2xx` range indicate success. Codes in the `4xx` range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). Codes in the `5xx` range indicate an error with Tilled\'s servers (these are rare).  Some `4xx` errors that could be handled programmatically (e.g., a card is declined) include an error code that briefly explains the error reported.  # Request IDs  Each API request has an associated request identifier. You can find this value in the response headers, under `request-id`. If you need to contact us about a specific request, providing the request identifier will ensure the fastest possible resolution.  # Metadata  Updateable Tilled objects—including [Account](#tag/Accounts), [Customer](#tag/Customers), [PaymentIntent](#tag/PaymentIntents), [Refund](#tag/Refunds), and [Subscription](#tag/Subscriptions)—have a `metadata` parameter. You can use this parameter to attach key-value data to these Tilled objects.  You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.  Metadata is useful for storing additional, structured information on an object. As an example, you could store your user\'s full name and corresponding unique identifier from your system on a Tilled [Customer](#tag/Customers) object. Metadata is not used by Tilled—for example, not used to authorize or decline a charge—and won\'t be seen by your users unless you choose to show it to them. Do not store any sensitive information (bank account numbers, card details, etc.) as metadata.  # Apple Pay  Tilled supports Apple Pay through the Tilled.js [`NativePaymentRequest`](#section/Tilled.js/Tilled.NativePaymentRequest) object.  In order to start accepting payments with Apple Pay, you will first need to validate the domains you plan to host the Apple Pay Button on by:  - Hosting Tilled\'s Apple Domain Verification File on the domain - Use the Tilled API to register the domain  ## Domain Verification File  Domains hosting an Apple Pay Button must be secured with HTTPS (TLS 1.2 or later) and have a valid SSL certificate.  Before [registering your domain](#operation/CreateApplePayDomain) with the Tilled API, you need to host Tilled\'s [Apple Domain Verification File](/apple-developer-merchantid-domain-association) on the domain at the path: `/.well-known/apple-developer-merchantid-domain-association`  # Tilled.js  Tilled.js is the easiest way to get started collecting payments. It allows you to embed a payments form in your application and stores credit card information securely on remote servers instead of passing through your network.  ## Installation  Add the following HTML snippet to your web page, preferably in the `<head>` tag of your web page:  ```html <script src=\"https://js.tilled.com/v1\"></script> ```  **Note**: To be PCI compliant, you must load Tilled.js directly from `https://js.tilled.com`. You cannot include it in a bundle or host it yourself.  ## Initialize  Instantiate an instance of `Tilled` by providing it with your Publishable API key and the Tilled account id of the account to perform the action on behalf of:  ```javascript const tilled = new Tilled(\'pk_…\', \'acct_…\'); ```  Use `Tilled(publishableKey, tilledAccount, options?)` to create an instance of the `Tilled` object. The `Tilled` object provides access to the rest of the Tilled.js SDK. Your Tilled publishable API key is required when calling this function, replace the sample API key above with your actual API key. You can retrieve your API key by accessing https://app.tilled.com/.  ### Sandbox Environment  For the sandbox environment, retrieve your API key from https://sandbox-api.tilled.com and instantiate an instance of `Tilled` with the following options:  ```javascript const tilled = new Tilled(\'pk_…\', \'acct_…\', { sandbox: true }); ```  ## Collecting Payment  The `tilled.Form` object can be used to collect credit card or bank ACH payment information securely.  The `tilled.NativePaymentRequest` object can be used to collect payment information using Apple Pay on supported browers and devices.  See below for more details.  ## Tilled.Form  ### Credit Card Form Example  ```javascript const form = tilled.form({   payment_method_type: \'card\', });  const fieldOptions = {   styles: {     base: {       fontFamily: \'Flexo, Muli, Helvetica Neue, Arial, sans-serif\',       color: \'#304166\',       fontWeight: \'400\',       fontSize: \'16px\',     },     invalid: {       \':hover\': {         textDecoration: \'underline dotted red\',       },     },     valid: {       color: \'#00BDA5\',     },   }, };  form.createField(\'cardNumber\', fieldOptions).inject(\'#card-number-element\'); form   .createField(\'cardExpiry\', { ...fieldOptions, placeholder: \'MM/YY\' })   .inject(\'#card-expiration-element\'); form.createField(\'cardCvv\', fieldOptions).inject(\'#card-cvv-element\'); form.build();  // submitButton is not defined, but imagine the form has a submit button the user would click submitButton.on(\'click\', () => {   tilled     .confirmPayment(payment_intent_client_secret, {       payment_method: {         form: form,         billing_details: {           name: \'John Doe\', // required           address: {             country: \'US\', // required             zip: \'12345\', // required             state: \'ST\',             city: \'City\',             street: \'123 ABC Lane\',           },           email: null,         },       },     })     .then(       (payment) => {         // payment is successful, payment will be an instance of PaymentIntent containing information about the transaction that was craeted       },       (err) => {         // show the error to the customer       },     ); }); ```  ```html <label   >Card Number   <div id=\"card-number-element\"></div> </label> <label   >Card Expiration   <div id=\"card-expiration-element\"></div> </label> <label   >Card CVV   <div id=\"card-cvv-element\"></div> </label> ```  ### ACH Bank Account Form Example  ```javascript const form = tilled.form({   payment_method_type: \'ach_debit\', });  form.createField(\'bankRoutingNumber\').inject(\'#bank-routing-number-element\'); form.createField(\'bankAccountNumber\').inject(\'#bank-account-number-element\'); form.build();  // submitButton is not defined, but imagine the form has a submit button the user would click submitButton.on(\'click\', () => {   tilled     .confirmPayment(payment_intent_client_secret, {       payment_method: {         form: form,         billing_details: {           name: \'John Doe\', // required           address: {             country: \'US\', // required             zip: \'12345\', // required             state: \'ST\', // required             city: \'City\', // required             street: \'123 ABC Lane\', // required           },           email: null, // optional         },         ach_debit: {           // required           account_type: \'checking\', // or \'savings\'         },       },     })     .then(       (payment) => {         // payment is successful, payment will be an instance of PaymentIntent containing information about the transaction that was craeted       },       (err) => {         // show the error to the customer       },     ); }); ```  ```html <label   >Bank Routing Number   <div id=\"bank-routing-number-element\"></div> </label> <label   >Bank Account Number   <div id=\"bank-account-number-element\"></div> </label> <!-- Also collect account type (\'checking\' or \'savings\'), and billing --> <!-- details to pass to the `confirmPayment` method. --> ```  ### tilled.form(options?)  This method creates a `Form` instance, which manages a set of inputs.  The `options` can contain the following properties:  - `payment_method_type` The payment method type being created by this form (`card` or `ach_debit`), defaults to `card`.  ### form.createField(inputType, options?)  This method creates a `FormField` instance  `inputType` can be one of the following values:  For Cards:  - `cardNumber` - `cardExpiry` - `cardCvv`  For ACH Debit:  - `bankRoutingNumber` - `bankAccountNumber`  `options` can contain the following properties:  - `disabled` The disabled state for the `FormField`. Default is `false`. - `autocomplete` The browser autocomplete state for the `FormField`. Default is `true`. - `styles` This option enables you to specify several CSS styles for your fields.  ### formField Styles  `FormField` objects are styled using a `Style` object, which consists of CSS properties nested under objects for any of the following variants:  - `base`, base variant—all other variants inherit from these styles - `valid`, applied when the FormField has valid input - `invalid`, applied when the FormField has invalid input  The following pseudo-classes can also be styled using a nested object inside of a variant:  - `:hover` - `:focus`  The following CSS properties are supported:  - `color` _string_ : The [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) CSS property. - `opacity` _string_ : The [opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) CSS property. - `letterSpacing` _string_ : The [leter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing) CSS property. - `textAlign` _string_ : The [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) CSS property. - `textIndent` _string_ : The [text-indent](https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent) CSS property. - `textDecoration` _string_ : The [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) CSS property. - `textShadow` _string_ : The [text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow) CSS property. - `font` _string_ : The [font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) CSS property. - `fontFamily` _string_ : The [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) CSS property. - `fontSize` _string_ : The [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) CSS property. - `fontStyle` _string_ : The [font-style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style) CSS property. - `fontWeight` _string_ : The [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) CSS property. - `lineWeight` _string_ : The [line-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/line-weight) CSS property. - `transition` _string_ : The [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) CSS property.  Note: `FormField` styles are are currently available for the `cardNumber`, `cardExpiry`, `cardCvv` types.  Example:  ```javascript const fieldOptions = {   styles: {     base: {       fontFamily: \'Flexo, Muli, Helvetica Neue, Arial, sans-serif\',       color: \'#304166\',       fontWeight: \'400\',       fontSize: \'16px\',     },     invalid: {       \':hover\': {         textDecoration: \'underline dotted red\',       },     },     valid: {       color: \'#00BDA5\',     },   }, };  form.createField(\'cardNumber\', fieldOptions).inject(\'#card-number-element\'); ```  ### formField.inject(\'#card-element\')  The `formField.inject` method attaches your `FormField` to the DOM. `formField.inject` accepts either a [DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString) or a DOM element.  You need to create a container DOM element to mount a FormField. If the container DOM element has a label, the FormField is automatically focused when its label is clicked. There are two ways to do this:  - Mount the instance within a `<label>`. - Create a `<label>` with a for attribute, referencing the ID of your container.  ### formField.on(\'change\', handler)  The change event is triggered when the `FormField`\'s value changes. When a change occurs, your `handler` function will be called with an `event` payload containing the following properties:  - `empty` true if the value is empty - `complete` if the value appears valid  ### form.build()  Call this method after you have defined your form to build and inject all the fields.  ## Tilled.NativePaymentRequest  ### NativePaymentRequest Button Example  ```javascript const form = tilled.form({   payment_method_type: \'card\', });  const nativePaymentRequest = this.tilled.nativePaymentRequest(null, {   total: {     label: \'Red Widgets\',     amount: \'$10\',   }, });  nativePaymentRequest.canMakePayment().then((result) => {   if (result) {     nativePaymentRequest.inject(\'#native-payment-element\');   } });  nativePaymentRequest.on(\'paymentmethod\', (ev: any) => {   let paymentMethod = ev.detail.paymentMethod;   this.tilled     .confirmPayment(payment_intent_client_secret, {       payment_method: paymentMethod.id,     })     .then((paymentIntent: PaymentIntent) => {       if (!paymentIntent) {         //failure         ev.detail.complete(\'fail\');       } else {         //success         ev.detail.complete(\'success\');       }     }); }); ```  ```html <label   ><!--Apple Pay Button Container-->   <div id=\"native-payment-element\"></div> </label> ```  ## Processing Payments Overview  Prior to displaying your checkout form and confirming the payment, your backend server will need to make an API call to Tilled to create a payment intent with the payment amount. You will pass the intent\'s client_secret to your front end. Use the `tilled.confirmPayment(client_secret, data)` method to process a payment with either the `ID` of an existing Tilled [[`PaymentMethod`]](#tag/PaymentMethod) or a [[`PaymentMethod`]](#section/Tilled.js/Payment-Method-Input) object.  ## Confirm The Payment Intent  ### `tilled.confirmPayment(client_secret, data)`  The `client_secret` is the `payment_intent.client_secret` generated from your backend server before displaying the payment form.  The `data` parameter can be one of the following:  - A string with the ID of an existing Tilled [`PaymentMethod`](#tag/PaymentMethods) (`\'pm_...\'`) - A [[`PaymentMethod`]](#section/Tilled.js/Payment-Method-Input)  #### Returns  `tilled.confirmPayment` returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which will resolve with a `PaymentIntent` object. See [`Payment`](https://developer.tilled.com/#operation--customers--customer--payment-charges-post) for more information. You can find the id of a newly created PaymentMethod by inspecting the `payment_intent.payment_method.id`. Consider passing it to your backend for persistence and re-use.  ## Payment Method Input  When Confirming Payments or Creating Payment Methods, the PaymentMethod object can contain:  - `form` [`Tilled.Form`] - `billingDetails`   - `name` the card holder\'s full name   - `address` an object representing the card holder\'s billing address   - `email` the email address of the card holder - `ach_debit` (for ACH Debit payments)   - `account_type` the ACH Debit Account type  ## Creating Payment Methods  If you just want to create a new payment method without processing a payment, use the `tilled.createPaymentMethod(paymentMethod)` method to securely pass collected payment information to Tilled\'s API.  **Note**: In most cases, this method is not necessary, because `tilled.confirmPayment` automatically creates a `PaymentMethod` and returns it on the `PaymentIntent` object.  #### Returns  `tilled.createPaymentMethod` returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which will resolve with a `PaymentMethod` object. See [`PaymentMethod`](https://developer.tilled.com/#operation--customers--customer--payment-methods-post) for more information.  [tilled-form]: #Collecting-Payment-Information  ## Styling  You can apply a CSS class to the DOM element container you are injecting a Tilled.js Form or NativePaymentRequest element into and the styles will be applied to the resulting injected elements.  ```html <div class=\"myCustomCss\" id=\"card-number-element\"></div> ```  # Webhooks  ## Receive event notifications with webhooks  Listen for events on your Tilled account so your integration can automatically trigger reactions.  Tilled uses webhooks to notify your application when an event happens in your account. Webhooks are particularly useful for asynchronous events like when a customer’s bank confirms a payment, a customer disputes a charge, or a recurring payment succeeds.  Begin using webhooks with your Tilled integration in just a couple steps:  - Create a webhook endpoint on your server. - Register the endpoint with Tilled to go live.  Not all Tilled integrations require webhooks. Keep reading to learn more about what webhooks are and when you should use them.  ### What are webhooks  _Webhooks_ refers to a combination of elements that collectively create a notification and reaction system within a larger integration.  Metaphorically, webhooks are like a phone number that Tilled calls to notify you of activity in your Tilled account. The activity could be the creation of a new customer or the payout of funds to your bank account. The webhook endpoint is the person answering that call who takes actions based upon the specific information it receives.  Non-metaphorically, the webhook endpoint is just more code on your server, which could be written in Ruby, PHP, Node.js, or whatever. The webhook endpoint has an associated URL (e.g., https://example.com/webhooks). The Tilled notifications are Event objects. This Event object contains all the relevant information about what just happened, including the type of event and the data associated with that event. The webhook endpoint uses the event details to take any required actions, such as indicating that an order should be fulfilled.  ### When to use webhooks  Many events that occur within a Tilled account have synchronous results–immediate and direct–to an executed request. For example, a successful request to create a customer immediately returns a Customer object. Such requests don’t require webhooks, as the key information is already available.  Other events that occur within a Tilled account are asynchronous: happening at a later time and not directly in response to your code’s execution. Most commonly these involve:  - The [Payment Intents API](#tag/PaymentIntents)  With these and similar APIs, Tilled needs to notify your integration about changes to the status of an object so your integration can take subsequent steps.  The specific actions your webhook endpoint may take differs based upon the event. Some examples include:  - Updating a customer’s membership record in your database when a subscription payment succeeds - Logging an accounting entry when a transfer is paid - Indicating that an order can be fulfilled (i.e., boxed and shipped)  ## Verifying signatures manually  The `tilled-signature` header included in each signed event contains a timestamp and one or more signatures. The timestamp is prefixed by `t=`, and each signature is prefixed by a `scheme`. Schemes start with `v`, followed by an integer. Currently, the only valid live signature scheme is `v1`.  ``` tilled-signature:t=1614049713663,v1=8981f5902896f479fa9079eec71fca01e9a065c5b59a96b221544023ce994b02 ```  Tilled generates signatures using a hash-based message authentication code ([HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). You should ignore all schemes that are not `v1`.  You can verify the webhook event signature by following these steps.  ### Step 1: Extract the timestamp and signatures from the header  Split the header, using the `,` character as the separator, to get a list of elements. Then split each element, using the `=` character as the separator, to get a prefix and value pair.  The value for the prefix `t` corresponds to the timestamp, and `v1` corresponds to the signature (or signatures). You can discard all other elements.  ### Step 2: Prepare the signed_payload string  The `signed_payload` string is created by concatenating:  - The timestamp (as a string) - The character `.` - The actual JSON payload (i.e., the request body)  ### Step 3: Determine the expected signature  Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the `signed_payload` string as the message.  ### Step 4: Compare the signatures  Compare the signature (or signatures) in the header to the expected signature. For an equality match, compute the difference between the current timestamp and the received timestamp, then decide if the difference is within your tolerance.  To protect against timing attacks, use a constant-time string comparison to compare the expected signature to each of the received signatures. 
 *
 * The version of the OpenAPI document: 1.0
 * Contact: integrations@tilled.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from "./configuration";
import { RequiredError, RequestArgs } from "./base";
import { AxiosInstance, AxiosResponse } from 'axios';

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com'

/**
 *
 * @throws {RequiredError}
 * @export
 */
export const assertParamExists = function (functionName: string, paramName: string, paramValue: unknown) {
    if (paramValue === null || paramValue === undefined) {
        throw new RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
}

/**
 *
 * @export
 */
export const setApiKeyToObject = async function (object: any, keyParamName: string, configuration?: Configuration) {
    if (configuration && configuration.apiKey) {
        const localVarApiKeyValue = typeof configuration.apiKey === 'function'
            ? await configuration.apiKey(keyParamName)
            : await configuration.apiKey;
        object[keyParamName] = localVarApiKeyValue;
    }
}

/**
 *
 * @export
 */
export const setBasicAuthToObject = function (object: any, configuration?: Configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object["auth"] = { username: configuration.username, password: configuration.password };
    }
}

/**
 *
 * @export
 */
export const setBearerAuthToObject = async function (object: any, configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const accessToken = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken()
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + accessToken;
    }
}

/**
 *
 * @export
 */
export const setOAuthToObject = async function (object: any, name: string, scopes: string[], configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken(name, scopes)
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + localVarAccessTokenValue;
    }
}

/**
 *
 * @export
 */
export const setSearchParams = function (url: URL, ...objects: any[]) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            } else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
}

/**
 *
 * @export
 */
export const serializeDataIfNeeded = function (value: any, requestOptions: any, configuration?: Configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
}

/**
 *
 * @export
 */
export const toPathString = function (url: URL) {
    return url.pathname + url.search + url.hash
}

/**
 *
 * @export
 */
export const createRequestFunction = function (axiosArgs: RequestArgs, globalAxios: AxiosInstance, BASE_PATH: string, configuration?: Configuration) {
    return <T = unknown, R = AxiosResponse<T>>(axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
        const axiosRequestArgs = {...axiosArgs.options, url: (configuration?.basePath || basePath) + axiosArgs.url};
        return axios.request<T, R>(axiosRequestArgs);
    };
}
