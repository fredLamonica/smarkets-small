import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'sdk-header',
  templateUrl: './sdk-header.component.html',
  styleUrls: ['./sdk-header.component.scss']
})
export class SdkHeaderComponent implements OnInit {
  //O topValue, serve para setar o valor de top do componente. Ex: <sdk-header [topValue]="'100px'"></sdk-header>
  @Input() topValue: string = '80px';
  @Input() heightValue: string = '64px';
  @Input() colorBackground: string = '#ffffff';

  @Input() route: string;

  public form: FormGroup;

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {}

  public back() {
    if (this.route == null) {
      this.location.back();
    } else {
      this.router.navigate([this.route]);
    }
  }
}
