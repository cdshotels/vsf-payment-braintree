# Vue Storefront Braintree Payment Extension

Braintree Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Daniel Coull - Sutton Silver].

Project updated by Libor Pansky, CDSHotels S.p.A.

![Demo](docs/demo.png)

## Installation

By hand (preferer):

```shell
$ git clone git@github.com:danrcoull/vsf-payment-braintree.git ./vue-storefront/src/modules/payment-braintree
```

Registration the Braintree module. Go to `./src/modules/client.ts`

```js
...
import { PaymentCashOnDeliveryModule } from './payment-cash-on-delivery'
import { PaymentBraintreeModule } from './payment-braintree'

export function registerClientModules () {
  registerModule(PaymentCashOnDeliveryModule)
  registerModule(PaymentBraintreeModule)
}
```

Add the endpoint to your config

```json
  "braintree" : {
    "endpoint": "http://localhost:8080/api/ext/payment-braintree"
  },
```

### Storefront package.json dependencies

```json
  "braintree": "^2.21.0",
  "braintree-web": "^3.55.0",
  "braintree-web-drop-in": "^1.21.0"
```

## Braintree payment API extension

Install additional extension for `vue-storefront-api`:

```shell
$ cp -f ./API/payment-braintree ../vue-storefront-api/src/api/extensions/
```

Add the config to your api config `local.json`

```json
"registeredExtensions": [
  ...
  "payment-braintree"
],
"extensions":{
   "paymentBraintree": {
      "mode": "sandbox",
      "merchantId": "your-merchant-id",
      "publicKey": "your-public-key",
      "privateKey": "your-private-key"
    },
}
```

### API package.json dependencies

```json
  "braintree": "^2.21.0"
```

## Braintree payment Checkout Review

Under your theme components/core/blocks/Checkout/OrderReview.vue add the following import to your script

```js
import BraintreeDropin from 'src/modules/payment-braintree/components/Dropin'

export default {
  components: {
    BaseCheckbox,
    ButtonFull,
    CartSummary,
    Modal,
    ValidationError,
    BraintreeDropin
  }
}  
```

And within the template after cart-summary add the following

```html
<div class="payment">
   <braintree-dropin v-if="payment.paymentMethod === 'vsfbraintree'"/>
</div>
````
