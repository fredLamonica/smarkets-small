import { Router, NavigationEnd } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

declare let gtag: any;
declare let window: any;
declare let document: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private GOOGLE_ANALYTICS_ID: string = environment.googleAnalyticsId;

  constructor(private router: Router) {}

  loadGoogleAnalytics() {
    // injecting GA main script asynchronously
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GOOGLE_ANALYTICS_ID}`;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // preparing GA API to be usable even before the async script is loaded
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());

    // tracking current url at app bootstrap
    gtag('config', `${this.GOOGLE_ANALYTICS_ID}`);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', this.GOOGLE_ANALYTICS_ID, {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
