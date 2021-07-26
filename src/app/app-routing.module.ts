import { NgModule } from '@angular/core';
import { TermsPage } from './pages/termspage/termspage';
import { Routes, RouterModule } from '@angular/router';
import { Tab1receivePage } from './pages/tab1receive/tab1receive.page';


const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'verifyemail', loadChildren: './pages/verifyemail/verifyemail.module#VerifyemailPageModule' },
  { path: 'forgot', loadChildren: './pages/forgot/forgot.module#ForgotPageModule' },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'usagehelp', loadChildren: './pages/usagehelp/usagehelp.module#UsageHelpModule' },
  { path: 'kycpage', loadChildren: './pages/firebasekyc-page/firebasekyc-page.module#FirebaseKycPageModule' },
  { path: 'termspage', component: TermsPage },
  { path: 'setting', loadChildren: './pages/serverless-setting/serlessetting.module#SerlessettingPageModule' },
  { path: 'support', loadChildren: './pages/support/support.module#SupportModule' },
  { path: 'sourcefund', loadChildren: './pages/sourcefund/sourcefund.module#SourcefundModule' },
  { path: 'wallet', loadChildren: './pages/tab4wallet/tab4.module#Tab4PageModule' },
  { path: 'transactions', loadChildren: './pages/tab2transactions/tab2.module#Tab2PageModule' },
  { path: 'transactions/:txid', loadChildren: './pages/tab2transactions/tab2.module#Tab2PageModule' },
  { path: 'sending', loadChildren: './pages/tab3sending/tab3sending.module#Tab3sendingPageModule' },
  { path: 'receiving', component: Tab1receivePage },
  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
