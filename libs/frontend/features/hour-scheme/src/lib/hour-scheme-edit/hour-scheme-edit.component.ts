import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hour-master-hour-scheme-edit',
  templateUrl: './hour-scheme-edit.component.html',
  styleUrls: ['./hour-scheme-edit.component.scss'],
})
export class HourSchemeEditComponent {
  hsForm: FormGroup = new FormGroup({
    date: this.fb.control(Date.now(), Validators.required),
    rows: this.fb.array([
      this.fb.group({
        project: this.fb.control('', Validators.required),
        hours: this.fb.control(0, Validators.required),
        machine: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
      })
    ])
  });

  constructor(private fb: FormBuilder) {}
}
