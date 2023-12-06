import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert, AlertService } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hour-master-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  alert!: Alert;
  staticAlertClosed = false;

  constructor(private readonly alertService: AlertService) { }

  ngOnInit(): void {
    this.sub = this.alertService.alert$.subscribe((alert) => {
      this.alert = alert;
      this.staticAlertClosed = false;
      setTimeout(() => (this.staticAlertClosed = true), 5000);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  close(): void {
    this.staticAlertClosed = true;
  }
}
