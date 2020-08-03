import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OfferSelectedService } from 'src/app/core/services/offer-selected.service';
import { DealService } from 'src/app/core/services/deal.service';
import { ProgramService } from 'src/app/core/services/program.service';
import { SesionService } from 'src/app/core/services/sesion.service';
import { DebtsService } from 'src/app/core/services/debts.service';
import { Router } from '@angular/router';
import { SignService } from 'src/app/core/services/sign.service';
import { BrokerService } from 'src/app/core/services/broker.service';
import { LoadingService } from 'src/app/core/services/loading.service';

declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {
  public obligation: boolean = false;
  constructor(
    public select: OfferSelectedService,
    public agree: DealService,
    public program: ProgramService,
    public sesion: SesionService,
    public debtService: DebtsService,
    public router: Router,
    public sign: SignService,
    public broker: BrokerService,
    public loading: LoadingService
  ) {
    

  }

  ngOnInit() {

  }

  open(data: any) {
    this.program.open(data);
  }

  back() {
    this.router.navigate(['/propuesta']);
  }

  openSignature() {
    this.sign.openSign();
  }

  confirmOffer(item: any) {
    this.loading.open('Por favor espera un momento ...', '', 'assets/images/animations/loading_clock.json', 'animation', true);
    this.select.offer = item;
    //this.broker.account = this.select.offer.agreement.idUserProduct
    const data = {
      sessionID: this.sesion.sesionCookie,
      de: this.debtService.debtSelect.de,
      offer: this.select.offer
    };

    if (!this.agree.agreements.isObligation) {
      this.broker.guardarPropuesta(data).subscribe((propuesta: any) => {
        //this.broker.account = this.agree.debtItem.numberAccount
        setTimeout(() => {
          $('#loading').modal('hide');
        }, 1000);
        //this.router.navigate(['/deudas']);
        this.router.navigate(['/imprimir']);
      }, error => {
        $('#loading').modal('hide');
        this.router.navigate(['/deudas']);

      });
    } else {
      const obligation = {
        sessionID: this.sesion.sesionCookie,
        obligation: this.select.obligation,
        offer: this.select.offer
      };
      this.broker.guardarPropuestaObligacion(obligation).subscribe((propuesta: any) => {
        //this.broker.account = this.agree.debtItem.numberAccount
        setTimeout(() => {
          $('#loading').modal('hide');
        }, 1000);
        //this.router.navigate(['/deudas']);
        this.router.navigate(['/imprimir']);
      }, (error: any) => {
        $('#loading').modal('hide');
        this.router.navigate(['/deudas']);

      });
    }

  }

  acceptCheck() {
    this.sign.acceptCheckService();
  }
}