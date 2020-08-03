import { Component, OnInit } from '@angular/core';
import { DealService } from 'src/app/core/services/deal.service';
import { ProgramService } from 'src/app/core/services/program.service';
import { DebtsService } from 'src/app/core/services/debts.service';
import { OfferSelectedService } from 'src/app/core/services/offer-selected.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-agree',
  templateUrl: './agree.component.html',
  styleUrls: ['./agree.component.scss']
})
export class AgreeComponent implements OnInit {

  public obligation: boolean = false;
  public listOffers: any;

  constructor(public agree: DealService,
    public program: ProgramService,
    public debtService: DebtsService,
    public select: OfferSelectedService,
    public router: Router) {
    
    //console.log("Ofertas ---> ", this.agree.agreements)
    
    if (this.agree.agreements === null) {
      this.router.navigate(['/deudas']);
    }


  }

  ngOnInit() {
    this.isObligation();
  }

  public isObligation() {
    if (this.agree.agreements.isObligation) {
      this.obligation = true;
      this.listOffers = this.agree.agreements.data;
    }
  }

  open(data) {
    this.program.open(data);
    console.log("Data", data)
  }
  openModal(item) {
    this.agree.open(item);
    this.agree.companyParams(item);
    this.debtService.debtSelect = item;
  }

  saveOffer(item) {
    this.select.offer = item;
    this.router.navigate(['/confirmar']);
    
  }
}
