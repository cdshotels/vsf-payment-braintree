import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { module } from './store';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import { isServer } from '@vue-storefront/core/helpers';

const KEY = 'braintree';
const VSF_BRAINTREE_CODE = 'vsfbraintree';

export const PaymentBraintreeModule: StorefrontModule = function({ store }) {
  store.registerModule(KEY, module);

  store.dispatch('checkout/addPaymentMethod', {
    title: 'Braintree',
    code: VSF_BRAINTREE_CODE,
    cost: 0,
    costInclTax: 0,
    default: true,
    offline: false
  });

  if (!isServer) {
    let isCurrentPaymentMethod = false;

    const invokePlaceOrder = () => {
      if (isCurrentPaymentMethod) {
        // should it be here? Click event is listened in Dropin file and order is confirmed after payment...
        EventBus.$emit('checkout-do-placeOrder', {});
      }
    };
    EventBus.$on('checkout-before-placeOrder', invokePlaceOrder);

    EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      let methods = store.state['payment-backend-methods'].methods;
      if (
        paymentMethodCode === VSF_BRAINTREE_CODE &&
        methods !== null &&
        methods.find(
          (item) =>
            item.code === paymentMethodCode && item.is_server_method === true
        )
      ) {
        isCurrentPaymentMethod = true;
      } else {
        isCurrentPaymentMethod = false;
      }
    });
  }
};

// const moduleConfig: VueStorefrontModuleConfig = {
//   key: KEY,
//   store: { modules: [{ key: KEY, module: module }], plugin },
//   beforeRegistration
// }

// export const Braintree = new VueStorefrontModule(moduleConfig)
