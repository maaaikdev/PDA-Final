import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerDebts } from '../models/customerDebts.model';
import { ObligationModel } from '../models/obligation.model';

declare var $: any;

interface Companie {
  name: string;
  quantity: number;
  checked: boolean;
}

interface State {
  status: string;
  quantity: number;
  name: string;
  checked: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  debt: any;
  account: any;
  debtLength: any;
  debtSelect: any;
  obligationSelect: any;
  customerDebts: CustomerDebts = null;
  obligations: ObligationModel = null;
  balanceObligation: any;
  entityOffer: ObligationModel = null;

  filteredItems: any;
  filteredObligations: any;
  filteredOther: any;
  
  select: any;
  filterCompany = false;
  filterState = false;
  
  filters: {
    companies: Array<Companie>;
    state: Array<State>;
  };

  constructor(public http: HttpClient) {

    this.filters = {
      companies: [],
      state: []
    };    
  }

  typeFilter:string;
  

  crearFiltros(type:string) {
    this.typeFilter = type;
    this.filters.state = [];
    this.filters.companies = [];
    switch (type) {
      case "obl":
       this.filtrosOblications();
        break;
      case "debs":
        this.filtrosDebs();
        break;
      default:
        break;
    }
  }

  
  filtrosOblications(){

    this.filters.state.push( { status: 'AL DIA', quantity: 0, name: 'Al día', checked: false } );
    this.filters.state.push( { status: 'NEGOCIADA', quantity: 0, name: 'Negociada', checked: false } );
    this.filters.state.push( { status: 'ACTIVA', quantity: 0, name: 'Activa', checked: false } );
    
    for (const oblig of this.obligations.data ) {
     // States
      switch ( oblig.accountStatus ) {
        case 'ACTIVA':
          const activa = this.filters.state.findIndex( obj => obj.status === 'ACTIVA' );
          this.filters.state[activa].quantity = this.filters.state[activa].quantity + 1;
          break;
        case 'AL DIA':
          const aldia = this.filters.state.findIndex( obj => obj.status === 'AL DIA' );
          this.filters.state[aldia].quantity = this.filters.state[aldia].quantity + 1;
          break;
        case 'NEGOCIADA':
          const negociacion = this.filters.state.findIndex( obj => obj.status === 'NEGOCIADA' );
          this.filters.state[negociacion].quantity = this.filters.state[negociacion].quantity + 1;
          break;
      }

      // Companies
      const companie = this.filters.companies.findIndex( obj => obj.name === oblig.company.name );
      if (companie >= 0) {
        this.filters.companies[companie].quantity = this.filters.companies[companie].quantity + 1;
      } else {
        this.filters.companies.push( { quantity: 1, name: oblig.company.name, checked: false  } );
      }
    }
  }

  filtrosDebs(){
    this.filters.state.push( { status: 'EN MORA', quantity: 0, name: 'En mora', checked: false } );
    this.filters.state.push( { status: 'AL DIA', quantity: 0, name: 'Al día', checked: false } );
    this.filters.state.push( { status: 'EN NEGOCIACION', quantity: 0, name: 'En negociación', checked: false } );
    this.filters.state.push( { status: 'CON ACUERDO', quantity: 0, name: 'Con acuerdo', checked: false } );

    for (const debt of this.customerDebts.responseObject.debts ) {
      // States
      switch ( debt.accountStatuts ) {
        case 'EN MORA':
          const mora = this.filters.state.findIndex( obj => obj.status === 'EN MORA' );
          this.filters.state[mora].quantity = this.filters.state[mora].quantity + 1;
          break;
        case 'AL DIA':
          const aldia = this.filters.state.findIndex( obj => obj.status === 'AL DIA' );
          this.filters.state[aldia].quantity = this.filters.state[aldia].quantity + 1;
          break;
        case 'EN NEGOCIACION':
          const negociacion = this.filters.state.findIndex( obj => obj.status === 'EN NEGOCIACION' );
          this.filters.state[negociacion].quantity = this.filters.state[negociacion].quantity + 1;
          break;
        case 'CON ACUERDO':
          const acuerdo = this.filters.state.findIndex( obj => obj.status === 'CON ACUERDO' );
          this.filters.state[acuerdo].quantity = this.filters.state[acuerdo].quantity + 1;
          break;
      }

      // Companies
      const companie = this.filters.companies.findIndex( obj => obj.name === debt.nameCompany );
      if (companie >= 0) {
        this.filters.companies[companie].quantity = this.filters.companies[companie].quantity + 1;
      } else {
        this.filters.companies.push( { quantity: 1, name: debt.nameCompany, checked: false  } );
      }
    }
  }

  aplicarFiltros() {

    const comps = this.filters.companies.filter(obj => obj.checked === true);
    const states = this.filters.state.filter(obj => obj.checked === true);

    for (let con of comps) {
      var boxFilter = $(".btn-company").addClass('d-inline-block');
      var btn = document.createElement("button");
      btn.setAttribute("class", "btn_class");
      btn.append(con.name);
      boxFilter.append(btn)
    };

    for (let con of states) {
      var boxFilter = $(".btn-statusAll").addClass('d-inline-block');
      var btn = document.createElement("button");
      btn.setAttribute("class", "btn_status");
      btn.append(con.name);
      boxFilter.append(btn)
    };

    switch (this.typeFilter) {
      case "obl":
        if (comps.length > 0 || states.length > 0) {

          this.filteredObligations = this.obligations.data.filter(function (item) {

            if (comps.length > 0 && states.length > 0) {
              const compFind = comps.findIndex(obj => obj.name === item.company.name);
              const staFind = states.findIndex(obj => obj.status === item.accountStatus);

              if (compFind >= 0 && staFind >= 0) {
                return true;
              } else {
                return false;
              }
            } else if (comps.length > 0 && states.length === 0) {
              const compFind = comps.findIndex(obj => obj.name === item.company.name);
              if (compFind >= 0) {
                return true;
              } else {
                return false;
              }
            } else if (comps.length === 0 && states.length > 0) {
              const staFind = states.findIndex(obj => obj.status === item.accountStatus);
              if (staFind >= 0) {
                return true;
              } else {
                return false;
              }

            }
          });
        } else {
          this.filteredObligations = this.obligations.data;
        }
        break;
      case "debs":
        if (comps.length > 0 || states.length > 0) {
          const model = this;
          this.filteredItems = this.customerDebts.responseObject.debts.filter(function (item) {
            if (comps.length > 0 && states.length > 0) {
              const compFind = comps.findIndex(obj => obj.name === item.nameCompany);
              const staFind = states.findIndex(obj => obj.status === item.accountStatuts);

              if (compFind >= 0 && staFind >= 0) {
                return true;
              } else {
                return false;
              }
            } else if (comps.length > 0 && states.length === 0) {
              const compFind = comps.findIndex(obj => obj.name === item.nameCompany);
              if (compFind >= 0) {
                return true;
              } else {
                return false;
              }
            } else if (comps.length === 0 && states.length > 0) {
              const staFind = states.findIndex(obj => obj.status === item.accountStatuts);
              if (staFind >= 0) {
                return true;
              } else {
                return false;
              }
            }
          });
        } else {
          this.filteredItems = this.customerDebts.responseObject.debts;
        }
        break;
      default:
        break;
    }
  }  

  limpiarFiltros() {
    for (const companie of this.filters.companies ) {
      companie.checked = false;
      $(".btn-company").remove('.d-inline-block'); 
      $('.btn_class').remove();
    }
    for (const state of this.filters.state ) {
      state.checked = false;
      $(".btn-statusAll").remove('.d-inline-block');
      $('.btn_status').remove();
    }

    switch (this.typeFilter) {
      case "obl":
          this.filteredObligations = this.obligations.data;
        break;
      case "debs":
          this.filteredItems = this.customerDebts.responseObject.debts;
        break;
      default:
        break;
    }
   
  }
  

}
