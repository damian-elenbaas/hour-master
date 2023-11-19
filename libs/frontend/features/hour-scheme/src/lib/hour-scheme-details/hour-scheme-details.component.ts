import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Modal } from 'flowbite';

@Component({
  selector: 'hour-master-hour-scheme-details',
  templateUrl: './hour-scheme-details.component.html',
  styleUrls: ['./hour-scheme-details.component.scss'],
})
export class HourSchemeDetailsComponent implements OnInit {
  hourSchemeId: Id | null = null;
  hourScheme: IHourScheme | null = null;
  subscription: Subscription | null = null;
  popUpModal!: Modal;
  totalHours = 0;

  constructor(
    private route: ActivatedRoute,
    private hourSchemeService: HourSchemeService,
    public location: Location
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.route.paramMap.subscribe((params) => {
      this.hourSchemeId = params.get('id') as Id;
      this.subscription = this.hourSchemeService
        .details(this.hourSchemeId)
        .subscribe((hourScheme) => {
          console.log('hourScheme', hourScheme);
          this.hourScheme = hourScheme;
          this.totalHours = hourScheme?.rows?.reduce((acc, row) => {
            return acc + row.hours;
          }, 0) || 0;
        });
    })
  }

  delete(): void {
    this.popUpModal.hide();
    this.hourSchemeService.delete(this.hourSchemeId as Id).subscribe(() => {
      this.location.back();
    });
  }
}
