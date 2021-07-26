import { Component , OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { Tab1receivePage } from './pages/tab1receive/tab1receive.page';
import { Router } from '@angular/router';
import { environment } from './pages/config/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  showSplash = true;

  menutitle = (environment.network=='testnet')?environment.tmenutitle:environment.menutitle;

  public puppirecordPages = [
    {
      title: 'Transactions',
      url: '/transactions',
      icon: 'arrow-dropleft-circle'
    }
   ];

  public puppiaccountPages = [
  ];
  public puppisettingPages = [
    {
      title: 'Login ',
      url: '/login',
      icon: 'person'
    },
    {
      title: 'Setting',
      url: '/setting',
      icon: 'settings'
    },
    {
      title: 'Support',
      url: '/support',
      icon: 'help'
    },

  ];
  public puppiworkPages = [
    {
      title: 'Home',
      url: '/tabs/tab1',
      icon: 'home'
    },
    {
      title: 'Wallet ',
      url: '/tabs/tab4',
      icon: 'wallet'
    },
    {
      title: 'Receive Dash',
      url: '/tabs/tab3',
      icon: 'return-left'
    },
    {
      title: 'Send Dash',
      url: '/tabs/tab2',
      icon: 'return-right'
    },
  ];

  backButtonSubscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    protected deeplinks: Deeplinks
//    private firebaseDynamicLinks: FirebaseDynamicLinks
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
       setTimeout( async ()=>{
      this.showSplash = false;
      }, 2000);


    });
   
  }
  
  ngOnInit() {
 
  }

  exitfunction() {
      alert(" You are exiting the app");
      navigator['app'].exitApp();

  }
  ngAfterViewInit() {

    this.platform.ready().then(() => {
       this.deeplinks.route( {
        '/tabs/tab3': Tab1receivePage,
        '/tabs/tab3/:contract': Tab1receivePage,
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
        //alert('Successfully matched route ='+ JSON.stringify(match));
     setTimeout(() => {
		this.router.navigate([ match.$link.path ]) ;
			}, 1000);

      },
      (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
     });

    this.platform.backButton.subscribe();
     this.backButtonSubscription = this.platform.backButton.subscribe(() => {
// commented to prevent exit on back button
//      navigator['app'].exitApp();
    });
  }
  ngOnDestroy() {
   this.backButtonSubscription.unsubscribe();
  }

}
