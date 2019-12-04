<template>
  <div class="braintree" id="braintree" />
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import store from '@vue-storefront/core/store';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import dropin from 'braintree-web-drop-in';

export default {
  name: 'BraintreeDropin',
  data() {
    const storeView = currentStoreView();
    return {
      loader: false,
      commit: true,
      nonce: '',
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_') // Convert to PayPal format of locale
    };
  },
  mounted() {
    this.configureBraintree();
  },
  computed: {
    ...mapGetters({ cartTotals: 'cart/getTotals' }),
    grandTotal() {
      return this.cartTotals.find((seg) => seg.code === 'grand_total').value;
    }
  },
  methods: {
    configureBraintree() {
      var self = this;
      store
        .dispatch('braintree/generateToken')
        .then((resp) => {
          // var dropin = require("braintree-web-drop-in");

          console.debug('Code for braintree:' + resp);

          var button = document.querySelector('.place-order-btn');

          dropin.create(
            {
              authorization: resp,
              container: '#braintree',
              paypal: {
                flow: 'checkout',
                amount: this.getTransactions().amount.total,
                currency: this.getTransactions().amount.currency
              }
            },
            function(createErr, instance) {
              button.addEventListener('click', () => {
                // if (instance.isPaymentMethodRequestable()) {
                setTimeout(() => {
                  instance.requestPaymentMethod((err, payload) => {
                    if (!err) {
                      console.debug(payload);
                      // Submit payload.nonce to your server
                      self.nonce = payload.nonce;
                      console.debug('success');
                      EventBus.$emit('checkout-do-placeOrder', {
                        payment_method_nonce: self.nonce
                      });
                    } else {
                      console.error(err);
                    }
                  });
                  // .catch(requestPaymentMethodErr => {
                  //   // No payment method is available.
                  //   // An appropriate error will be shown in the UI.
                  //   console.error(requestPaymentMethodErr);
                  // });
                }, 400);
                // }
              });
            }
          );
          // .catch(error => {
          //   console.error(error);
          // });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTransactions() {
      return { amount: { total: this.grandTotal, currency: this.currency } };
    },
    getNonce() {
      return {
        nonce: this.nonce,
        total: this.grandTotal,
        currency: this.currency
      };
    },
    doPayment(data, actions) {
      return store.dispatch('braintree/doPayment', this.getNonce());
    },
    onAuthorize(data, actions) {
      return true;
    },
    onCancel(data) {
      EventBus.$emit('payment-braintree-cancelled', data);
    }
  }
};
</script>
