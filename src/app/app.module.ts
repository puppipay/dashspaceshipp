import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { PackerService } from './providers/packer.service';
import { WindowService } from './providers/windowservice';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { NgSpinKitModule } from 'ng-spin-kit'
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { TabsPage } from './pages/tabs/tabs.page';
import { TabsPageRoutingModule } from './pages/tabs/tabs.router.module';

import { PipesModule } from './pages/pipes/pipes.module';


import { NgxQRCodeModule } from 'ngx-qrcode2';


import { IonicStorageModule } from '@ionic/storage';
import { QrdisplaymodalPage } from './pages/qrdisplaymodal/qrdisplaymodal.page';
import { PaydisplaymodalPage } from './pages/paydisplaymodal/paydisplaymodal.page';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { TermsPage } from './pages/termspage/termspage';

import { Tab1receivePage } from './pages/tab1receive/tab1receive.page';
import { AppRoutingModule } from './app-routing.module';
//import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { ChangellyCalls } from './providers/changelly';


import { Dashcoin } from './providers/dashcoin';
import { SocialShareService } from './providers/socialshare';
import { PlatformProvider } from './providers/platform/platform';
import { UtilityService } from './providers/utility';
import { Logger } from './providers/logger/logger';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
//import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { Firebase } from '@ionic-native/firebase/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { WebView } from '@ionic-native/ionic-webview/ngx';






import { environment } from '../environments/environment';

//let  firebaseconfig = environment.sandboxfirebaseconfig;


@NgModule({
  declarations: [AppComponent, 
    TermsPage,
    Tab1receivePage,
    TabsPage,
    QrdisplaymodalPage,
    PaydisplaymodalPage,
  ],
  entryComponents: [
   QrdisplaymodalPage,
   PaydisplaymodalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    PipesModule,
    NgSpinKitModule,
    TabsPageRoutingModule,
    NgxQRCodeModule,
//    ZXingScannerModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'indexeddb',  'websql']
    }),


  ],
  providers: [
    StatusBar,
    PackerService,
    WebView,
    ChangellyCalls,
    Dashcoin,
    ChangellyCalls,
    PlatformProvider,
    Logger,
    UtilityService,
//    QRScanner,
    File,
//    Firebase,
    FilePath,
//    FirebaseAuthentication,
    BarcodeScanner,
    SocialSharing,
    WindowService,
    SocialShareService,
    Device,
    Clipboard,
    Deeplinks,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class AppModule {}
