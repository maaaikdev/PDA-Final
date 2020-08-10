import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DebtsService } from 'src/app/core/services/debts.service';
import { CustomerDebts } from 'src/app/core/models/customerDebts.model';
import { Router, NavigationEnd } from '@angular/router';
import { SesionService } from 'src/app/core/services/sesion.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { BrokerService } from 'src/app/core/services/broker.service';
import { DealService } from 'src/app/core/services/deal.service';
import { OfferSelectedService } from 'src/app/core/services/offer-selected.service';
import { DOCUMENT } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent implements OnInit {

  url: string;
  errorUrl = false;
  initial = false;
  account: any;
  //OBLIGATIONS
  activeObligation: number = 0;
  activeDebts: number = 0;

  // DEBTS
  // No Debts
  navLeft = true;
  noDebtsFreemium = false;
  alertNoDebts = false;
  // No Debts
  debtsToday = true;  
  alertDebts = true;
  obligacionesNegociables = false;
  reportesNegociables = true;
  otrosReportes = false;
  goFreemium = false;  

  constructor(
    public debtModal: DealService,
    public broker: BrokerService,
    public debtsService: DebtsService,
    public router: Router,
    public sesion: SesionService,
    public select: OfferSelectedService,
    public loading: LoadingService) {


    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.url = val.url;
        if (val.url === '/error') {
          this.errorUrl = true;
        }
        if (val.url !== '/') {
          this.initial = true;
        } else {
          this.initial = false;
        }
      }
    });
    // this.getObligations();
    this.consultarDeudas();   

  }

  ngOnInit() {
    this.select.state = null;
    this.debtsService.debtSelect = null;
  }

  openDeal(item) {
    // this.debtsService.obligations.isObligation = false;
    this.debtModal.open(item);
    this.debtModal.companyParams(item);
    this.debtsService.debtSelect = item;
  }

  consultarDeudas() {
    this.loading.open('Por favor espera un momento ...', 'Estamos validando tu propuesta', 'assets/images/animations/loading_clock.json', 'animation', true);
    this.broker.consultarDeudas().subscribe((response: CustomerDebts) => {
      this.debtsService.customerDebts = response;
      if (this.debtsService.customerDebts.error) {
        this.router.navigate(['/error']);
      } else {
        this.debtsService.filteredItems = Object.assign([], this.debtsService.customerDebts.responseObject.debts);
        this.debtsService.debt = response.responseObject.debts;
        this.debtsService.debtLength = response.responseObject.countDebtsArrears;
        for (let deb of this.debtsService.debt) {
          if (deb.accountStatuts == "EN MORA") {
            this.activeDebts++;
          }
        }
     
      }
      setTimeout(() => {
        $('#loading').modal('hide');
      }, 200);

    },
      (error) => {
        $('#loading').modal('hide');
        this.router.navigate(['/error']);
        this.sesion.sesionCookie = null;
      });
  }

  verEstado(deuda: any, nitCompany: any, numberAccount: string, type: number) {

    // if (type == 2) {
    //   this.debtsService.obligations.isObligation = true;
    //   let withoutObfuscating = numberAccount.replace("******", "");
    //   numberAccount = withoutObfuscating;
    // } else {
    //   this.debtsService.obligations.isObligation = false;
    // }
    const data = {
      de: deuda,
      type: type,
      project: environment.product,
      onlyQuery: true,
      withPass: false,
      byEmail: false,
      country: environment.country,
      idSession: this.sesion.sesionCookie
    };

    this.broker.descargarPDF(data).subscribe((estado: any) => {
      this.select.state = estado;
      this.select.de = data.de;
      this.select.nitCompany = nitCompany;
      this.broker.dataLinea = this.select.nitCompany;
      this.broker.nameCompanyAccept = this.select.state.agreement.nameBank;
      this.broker.account = numberAccount;
      this.router.navigate(['/imprimir']);
    }, error => {

    });
  }

  // public getObligations() {
  //   this.broker.findObligations().subscribe((response: any) => {
  //     this.debtsService.obligations = response;
  //     if (this.debtsService.obligations.status == "ERROR") {
  //       //Validar si necesario mostrar error o otra pagina ahora existen 2 servicios cargando en el controlador
  //       // this.router.navigate(['/error']);
  //     } else {
  //       this.debtsService.filteredObligations = Object.assign([], this.debtsService.obligations.data);

  //       if (this.debtsService.obligations.data.length > 0) {
  //         for (let obl of this.debtsService.obligations.data) {
  //           if (obl.accountStatus == "ACTIVA") {
  //             this.activeObligation++;
  //           }
  //         this.debtsService.crearFiltros("obl");
  //         }
  //       }
  //     }
  //   },
  //     (error) => {
  //       $('#loading').modal('hide');
  //       this.router.navigate(['/error']);
  //       this.sesion.sesionCookie = null;
  //     });

  // }

  public negotiateObligation(obligation: any) {
    
    const request = {
      nit: obligation.company.nit,
      idSession: this.sesion.sesionCookie,
      productType: obligation.idProduct,
      numberAccount: obligation.numberAccount
    }

    let infoCompany = {
      nameCompany: obligation.company.name,
      nitCompany: obligation.company.nit,
      nameProduct: obligation.product.name,
      numberAccount: obligation.ofuscateNumberAccount.replace("******", ""),
      de: obligation._id.$oid
    }

    this.debtsService.debtSelect = infoCompany;

    try {
      this.broker.negotiateObligation(request).subscribe((response: any) => {
        this.debtsService.obligations = response;
        if (this.debtsService.obligations.status == "ERROR") {
          // this.router.navigate(['/error']);
        } else {
          this.infoCompanyObligation(obligation);
          this.debtsService.obligations.isObligation = true;
          this.debtModal.agreements = this.debtsService.obligations;
          this.debtsService.balanceObligation = obligation.balance;
          this.select.obligation = obligation._id.$oid;
          this.router.navigate(['/propuesta']);
        }
      })

    } catch (err) {
      console.log('Error: ', err);
    }

  }
  

  obligaciones() {
    var activedO = document.getElementById('btnObligations');
    var activedR = document.getElementById('btnNegativeReports');
    activedO.classList.add('activo');
    activedR.classList.remove('activo');
    this.obligacionesNegociables = true;
    this.reportesNegociables = false;
    this.otrosReportes = false;
    if (this.debtsService.obligations.data.length  > 0) {
       this.debtsService.crearFiltros("obl");
       }    
  }


  reportes() {
    var activedR = document.getElementById('btnNegativeReports');
    var activedO = document.getElementById('btnObligations');    
    activedR.classList.add('activo');
    activedO.classList.remove('activo');
    this.obligacionesNegociables = false;
    this.reportesNegociables = true;
    this.otrosReportes = false;
    if (this.debtsService.customerDebts.responseObject != null) {
      this.debtsService.crearFiltros("debs");
    }
  }
  oReportes() {
    this.obligacionesNegociables = false;
    this.reportesNegociables = false;
    this.otrosReportes = true;
  }


  infoCompanyObligation(item: any){
    // console.log('Find company', item);
    const data = {
      idProduct: item.idProduct,
      nit: item.company.nit,
      project: 'Ponte Al Dia',
      type: 2,
      country: environment.country,
      idSession: this.sesion.sesionCookie
    };
    this.broker.companyParams(data).subscribe((res: any) => {
      // console.log('res company get', res);
      this.select.offerBank = res;
  
    }, error => {
      //console.log('error company get params', error);
    });
  }
}