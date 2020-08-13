export const environment = {
  production: false,

  clientId: 'nJ6Xpc/JYe9c/GfHqqeQhhATrrBFKaoXVZ6g/CJyvJg=',
  domain: 'localhost',
  gtmPruebas: true,

  // APIEndpoint_authn: 'https://ws-authn-dev-co-sla-datacash.apps.appcanvas.net', //DEV
  // APIEndpoint_company: 'http://localhost:8081', //DEV
  // APIEndpoint_debts: 'http://localhost:8085', //DEV
  // APIEndpoint_ngttion: 'http://localhost:8080', //DEV
  
  // APIEndpoint_authn: 'https://demo-sso-ui-okta.a.apps.experian.com/authn-ws',
  APIEndpoint_authn: 'https://pontealdia.midatacredito.com/authn-ws',
  // APIEndpoint_authn: 'https://crtestapi.azurewebsites.net/',
  APIEndpoint_company: 'https://pontealdia.midatacredito.com/cmpnymnger-ws',
  APIEndpoint_debts: 'https://pontealdia.midatacredito.com/debtsmanager-ws',
  APIEndpoint_ngttion: 'https://pontealdia.midatacredito.com/ngttion-ws',
  
  negociarObligaciones: '/midatacredito/pontealdia/v1/obligation/offer',
  // consultarObligaciones: '/midatacredito/pontealdia/v1/obligation/list',
  guardarPropuestaObligacion: '/midatacredito/pontealdia/v1/obligation/agreement',

  consultaDeudas: '/midatacredito/pontealdia/v1/debt',
  negociarDeudas: '/EngineNegotiation/getOffers',
  descargarPDF: '/companymanager/paymentAgreement',
  guardarPropuesta: '/midatacredito/pontealdia/v1/agreement',
  pagarLinea: '/midatacredito/pontealdia/v1/audit/pay',
  
  urlLogin: 'https://okta-ui-dev-co-sla-datacash.apps.internal.appcanvas.net/login?product=pntd',
  urlRegister: 'https://okta-ui-dev-co-sla-datacash.apps.internal.appcanvas.net/registro?product=pntd',
  urlSeguridad: 'https://okta-ui-dev-co-sla-datacash.apps.internal.appcanvas.net/seguridad?product=pntd',
  EvidenteEP: {
    validateQues: 'http://localhost:4203/validation/api/v1/evidente/validateQuestionsCustomer',
    validateCusto: 'http://localhost:4203/validation/api/v1/evidente/validateCustomer'
  },
  country: 'CO',
  product: 'Ponte Al Dia'
};
/*
https://okta-ui-dev-co-sla-datacash.apps.appcanvas.net
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

