import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UsageHelp } from './usagehelp';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UsageHelp,
  ],
  imports: [
     RouterModule.forChild([
      {
        path: '',
        component: UsageHelp
      }
    ])

  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class UsageHelpModule {}
