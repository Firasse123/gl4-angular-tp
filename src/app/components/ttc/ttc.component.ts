import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [FormsModule, CurrencyPipe],
  selector: 'app-ttc',
  styleUrl: './ttc.component.css',
  templateUrl: './ttc.component.html',
})
export class TtcComponent {
  prixHT=signal(0);
  quantite=signal(1);
  tva=signal(18);

  prixUnitaireTTC= computed(()=> this.prixHT() * (1+ this.tva()/100));

  tauxRemise= computed( ()=>{
    const q=this.quantite();
    if(q>15) return 0.3;
    if(q>10) return 0.2;
    return 0;

  });

  totalBrut= computed(()=> this .prixUnitaireTTC() * this.quantite());
  remise=computed(()=> this.totalBrut() * this.tauxRemise());
  totalTTC= computed(()=> this.totalBrut() - this.remise());
}
