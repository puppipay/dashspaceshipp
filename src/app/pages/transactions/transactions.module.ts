import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TransactionsPage } from './transactions';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    TransactionsPage,
  ],
  imports: [
   
    RouterModule.forChild([
      {
        path: '',
        component: TransactionsPage
      }
    ])

  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TransactionsPageModule {}
