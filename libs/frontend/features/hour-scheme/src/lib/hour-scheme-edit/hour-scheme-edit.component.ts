import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHourScheme, IMachine, IProject, Id, UserRole } from '@hour-master/shared/api';
import { Modal } from 'flowbite';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-hour-scheme-edit',
  templateUrl: './hour-scheme-edit.component.html',
  styleUrls: ['./hour-scheme-edit.component.scss'],
})
export class HourSchemeEditComponent implements OnInit, OnDestroy {
  hourSchemeId!: Id;
  hsRowForm: FormGroup = this.fb.group({
    id: this.fb.control(''),
    project: this.fb.control('', Validators.required),
    hours: this.fb.control(0, [Validators.required, Validators.min(0)]),
    machine: this.fb.control(''),
    description: this.fb.control('', Validators.required),
  });
  hsForm: FormGroup = new FormGroup({
    date: this.fb.control(this.getCurrentDate(), Validators.required),
    rows: this.fb.array([])
  });
  subscriptionDetails!: Subscription;
  subscriptionAuth!: Subscription;
  addRowModal!: Modal;
  loaded = false;

  // TODO: Get projects and machines from API
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
        _id: 'admin-1',
        username: 'admin1',
        firstname: 'Admin 1',
        lastname: 'Admin 1',
        email: 'test@test.nl',
        role: UserRole.OFFICE
      },
    }
  ].sort((a, b) => a.name.localeCompare(b.name));
  // TODO: Get projects and machines from API
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
    private hourSchemeService: HourSchemeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const $modalElement: HTMLElement | null = document.querySelector('#addRowModal');
    if ($modalElement === null) throw new Error('Modal element not found');
    this.addRowModal = new Modal($modalElement);

    this.subscriptionAuth = this.authService.getUserTokenFromLocalStorage().subscribe((token) => {
      if (!token) {
        this.router.navigate(['/auth/login']);
      }
    });

    this.subscriptionDetails = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          if (!params.get('id')) {
            return of(null);
          } else {
            this.hourSchemeId = params.get('id') as Id;
            return this.hourSchemeService.details(params.get('id') as Id);
          }
        })
      )
      .subscribe({
        next: (scheme: IHourScheme | null) => {
          if (scheme) {
            this.hsForm.patchValue({
              date: this.convertDate(new Date(scheme.date)),
              rows: scheme.rows?.map(row => ({
                project: row.project.id,
                hours: row.hours,
                machine: row.machine?.id,
                description: row.description,
              }))
            });

            this.rows.clear();
            scheme.rows?.forEach(row => {
              this.rows.push(this.fb.group({
                project: this.fb.control(row.project.id, Validators.required),
                hours: this.fb.control(row.hours, [Validators.required, Validators.min(0)]),
                machine: this.fb.control(row.machine?.id),
                description: this.fb.control(row.description, Validators.required),
              }));
            });

          } else if (!scheme && this.hourSchemeId) {
            this.location.back();
          }
          this.loaded = true;
        },
        error: (error) => {
          console.error(error);
          this.location.back();
        }
      });

    return;
  }

  ngOnDestroy(): void {
    this.subscriptionAuth.unsubscribe();
    this.subscriptionDetails.unsubscribe();
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
      id: index,
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
    if (this.hsRowForm.invalid) return;
    if(this.hsRowForm.value.id !== '') return this.editRow(this.hsRowForm.value.id);

    const row = this.hsRowForm.value;

    this.rows.push(this.fb.group({
      project: this.fb.control(row.project, Validators.required),
      hours: this.fb.control(row.hours, [Validators.required, Validators.min(0)]),
      machine: this.fb.control(row.machine),
      description: this.fb.control(row.description, Validators.required),
    }));

    this.addRowModal.hide();
  }

  editRow(index: number): void {
    if (this.hsRowForm.invalid) return;

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

  // TODO: Move to utils?
  convertDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // TODO: Move to utils?
  getCurrentDate(): string {
    return this.convertDate(new Date());
  }

  onSubmit(): void {
    if (this.hourSchemeId) {
      this.update();
    } else {
      this.create();
    }
  }

  onCancel(): void {
    this.location.back();
  }

  create(): void {
    if (this.hsForm.invalid) return;

    const formData = this.hsForm.value;
    const date = new Date(formData.date);
    // TODO: Get worker from API

    const newHourScheme = {
      date: date,
      rows: formData.rows.map((row: any) => ({
        project: this.projects.find(p => p.id === row.project),
        hours: row.hours,
        machine: this.machines.find(m => m.id === row.machine),
        description: row.description,
      })),
      worker: {
        _id: '655b86d4b6267ea18bb9ddcb',
        username: 'Magisch',
        email: 'damian2003@outlook.com',
        firstname: 'Damian',
        lastname: 'Elenbaas',
        role: 'Kantoor',
      }
    } as IHourScheme;

    console.log(newHourScheme);

    this.hourSchemeService.create(newHourScheme).subscribe({
      next: (hourScheme: IHourScheme | null) => {
        if (hourScheme === null) return;

        this.location.back();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  update(): void {
    if (this.hsForm.invalid) return;

    const formData = this.hsForm.value;
    const date = new Date(formData.date);

    const updatedHourScheme = {
      _id: this.hourSchemeId,
      date: date,
      rows: formData.rows.map((row: any) => ({
        project: this.projects.find(p => p.id === row.project),
        hours: row.hours,
        machine: this.machines.find(m => m.id === row.machine),
        description: row.description,
      })),
      worker: {
        _id: '655b86d4b6267ea18bb9ddcb',
        username: 'Magisch',
        email: 'damian2003@outlook.com',
        firstname: 'Damian',
        lastname: 'Elenbaas',
        role: 'Kantoor',
      }
    } as IHourScheme;

    console.log(updatedHourScheme);

    this.hourSchemeService.update(updatedHourScheme).subscribe({
      next: (hourScheme: IHourScheme | null) => {
        if (hourScheme === null) return;

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

  findProject(id: Id): IProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  findMachine(id: Id): IMachine | undefined {
    return this.machines.find(m => m.id === id);
  }
}
