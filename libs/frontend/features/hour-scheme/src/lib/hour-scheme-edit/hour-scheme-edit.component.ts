import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHourScheme, IMachine, IProject, Id, UserRole } from '@hour-master/shared/api';
import { Modal } from 'flowbite';
import { HourSchemeService } from '../hour-scheme.service';

@Component({
  selector: 'hour-master-hour-scheme-edit',
  templateUrl: './hour-scheme-edit.component.html',
  styleUrls: ['./hour-scheme-edit.component.scss'],
})
export class HourSchemeEditComponent implements OnInit, OnDestroy {
  hourSchemeId!: Id;

  hsRowForm: FormGroup = this.fb.group({
      project: this.fb.control('', Validators.required),
      hours: this.fb.control(0, [Validators.required, Validators.min(0)]),
      machine: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
    });

  hsForm: FormGroup = new FormGroup({
    date: this.fb.control(this.getCurrentDate(), Validators.required),
    rows: this.fb.array([])
  });

  addRowModal!: Modal;

  projects: IProject[] = [
    {
      id: 'project-1',
      name: 'Project 1',
      location: {
        id: 'location-1',
        address: 'Address 1',
        city: 'City 1',
        postalCode: 'Postal Code 1',
      },
      admin: {
        id: 'admin-1',
        username: 'admin1',
        firstname: 'Admin 1',
        lastname: 'Admin 1',
        email: 'test@test.nl',
        role: UserRole.OFFICE
      },
    }
  ];
  machines: IMachine[] = [
    {
      id: 'machine-1',
      typeNumber: 'KTER-12-GBF',
      name: 'Kubota 4t',
    },
    {
      id: 'machine-2',
      typeNumber: 'GAWE-8-WWF',
      name: 'Alhmann 4t AE',
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private service: HourSchemeService
  ) {}

  ngOnInit(): void {
    const $modalElement: HTMLElement | null = document.querySelector('#addRowModal');
    if($modalElement === null) throw new Error('Modal element not found');
    this.addRowModal = new Modal($modalElement);

    // TODO: Get projects and machines from API
    return;
  }

  ngOnDestroy(): void {
    // TODO: Cleanup subscriptions
    return;
  }

  openAddRowModal(): void {
    this.hsRowForm.patchValue({
      project: '',
      hours: 0,
      machine: '',
      description: '',
    });
    this.addRowModal.show();
  }

  openEditRowModal(index: number): void {
    console.log(index);
    const row = this.rows.at(index);
    this.hsRowForm.patchValue({
      project: row.get('project')?.value,
      hours: row.get('hours')?.value,
      machine: row.get('machine')?.value,
      description: row.get('description')?.value,
    });
    this.addRowModal.show();
  }

  closeModal(): void {
    this.addRowModal.hide();
  }

  addRow(): void {
    if(this.hsRowForm.invalid) return;

    const row = this.hsRowForm.value;

    // Get project and machine object
    const project = this.projects.find(p => p.id === row.project);
    const machine = this.machines.find(m => m.id === row.machine);

    this.rows.push(this.fb.group({
      project: this.fb.control(project?.name, Validators.required),
      hours: this.fb.control(row.hours, [Validators.required, Validators.min(0)]),
      machine: this.fb.control(machine?.name ?? 'Geen machine gebruikt', Validators.required),
      description: this.fb.control(row.description, Validators.required),
    }));

    this.addRowModal.hide();
  }

  editRow(index: number): void {
    if(this.hsRowForm.invalid) return;

    const row = this.hsRowForm.value;
    this.rows.at(index).patchValue({
      project: row.project,
      hours: row.hours,
      machine: row.machine,
      description: row.description,
    });

    this.addRowModal.hide();
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    this.create();
  }

  onCancel(): void {
    this.location.back();
  }

  create(): void {
    if(this.hsForm.invalid) return;

    const formData = this.hsForm.value;
    const date = new Date(formData.date);

    // TODO: Get worker from API

    const newHourScheme = {
      date: date,
      rows: formData.rows.map((row: any) => ({
        project: row.project,
        hours: row.hours,
        machine: row.machine,
        description: row.description,
      })),
      worker: {
        id: 'user-1',
        username: 'jdoe',
        firstname: 'John',
        lastname: 'Doe'
      }
    } as IHourScheme;

    console.log(newHourScheme);

    this.service.create(newHourScheme).subscribe({
      next: (hourScheme: IHourScheme | null) => {
        if(hourScheme === null) return;

        this.location.back();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  get rows(): FormArray {
    return this.hsForm.get('rows') as FormArray;
  }
}
