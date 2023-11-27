import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHourScheme, IMachine, IProject, IUser, Id } from '@hour-master/shared/api';
import { Modal } from 'flowbite';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';
import { ProjectService } from '@hour-master/frontend/features/project';
import { MachineService } from '@hour-master/frontend/features/machine';
import { AlertService } from '@hour-master/frontend/common';

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
    rows: this.fb.array([]),
  });
  worker!: IUser;
  addRowModal!: Modal;
  token!: string;
  loaded = false;

  subscriptionDetails!: Subscription;
  subscriptionProjects!: Subscription;
  subscriptionMachine!: Subscription;
  projects: IProject[] = [];
  machines: IMachine[] = [];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private hourSchemeService: HourSchemeService,
    private authService: AuthService,
    private alertService: AlertService,
    private projectService: ProjectService,
    private machineService: MachineService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const $modalElement: HTMLElement | null =
      document.querySelector('#addRowModal');
    if ($modalElement === null) throw new Error('Modal element not found');
    this.addRowModal = new Modal($modalElement);

    this.subscriptionDetails = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.alertService.info('Je bent niet ingelogd!');
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params || !params.get('id')) {
            return of(null);
          } else {
            this.hourSchemeId = params.get('id') as Id;
            return this.hourSchemeService.details(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (scheme: IHourScheme | null) => {
          if (scheme) {
            this.hsForm.patchValue({
              date: this.convertDate(new Date(scheme.date)),
              rows: scheme.rows?.map((row) => ({
                project: row.project._id,
                hours: row.hours,
                machine: row.machine?._id,
                description: row.description,
              })),
            });

            this.rows.clear();
            scheme.rows?.forEach((row) => {
              this.rows.push(
                this.fb.group({
                  project: this.fb.control(
                    row.project._id,
                    Validators.required
                  ),
                  hours: this.fb.control(row.hours, [
                    Validators.required,
                    Validators.min(0),
                  ]),
                  machine: this.fb.control(row.machine?._id),
                  description: this.fb.control(
                    row.description,
                    Validators.required
                  ),
                })
              );
            });

            this.worker = scheme.worker;
          } else if (!scheme && this.hourSchemeId) {
            this.alertService.danger('Urenschema niet gevonden!');
            this.location.back();
          }
          this.loaded = true;
        },
        error: (error) => {
          this.alertService.danger('Urenschema niet gevonden!');
          this.router.navigate(['/hour-scheme']);
        },
      });

    this.subscriptionProjects = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.projectService.list({
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (projects: IProject[] | null) => {
          if (!projects) return;

          this.projects = projects;
        },
        error: (error) => {
          console.error(error);
        },
      });

    this.subscriptionMachine = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.machineService.list({
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (machines: IMachine[] | null) => {
          if (!machines) return;

          this.machines = machines;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
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
    if (this.hsRowForm.value.id !== '')
      return this.editRow(this.hsRowForm.value.id);

    const row = this.hsRowForm.value;

    this.rows.push(
      this.fb.group({
        project: this.fb.control(row.project, Validators.required),
        hours: this.fb.control(row.hours, [
          Validators.required,
          Validators.min(0),
        ]),
        machine: this.fb.control(row.machine),
        description: this.fb.control(row.description, Validators.required),
      })
    );

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

    this.authService
      .currentUser$
      .pipe(
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            const newHourScheme = {
              date: date,
              rows: formData.rows.map((row: any) => ({
                project: this.projects.find((p) => p._id === row.project),
                hours: row.hours,
                machine: this.machines.find((m) => m._id === row.machine),
                description: row.description,
              })),
              worker: user,
            } as IHourScheme;

            console.log(newHourScheme);
            return this.hourSchemeService.create(newHourScheme, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (hourScheme: IHourScheme | null) => {
          if (hourScheme === null) return;

          this.location.back();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  update(): void {
    if (this.hsForm.invalid) return;

    const formData = this.hsForm.value;
    const date = new Date(formData.date);

    this.authService
      .currentUser$
      .pipe(
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            console.log('User:', user);
            const updatedHourScheme = {
              _id: this.hourSchemeId,
              date: date,
              rows: formData.rows.map((row: any) => ({
                project: this.projects.find((p) => p._id === row.project),
                hours: row.hours,
                machine: this.machines.find((m) => m._id === row.machine),
                description: row.description,
              })),
              worker: this.worker,
            } as IHourScheme;

            console.log(updatedHourScheme);
            return this.hourSchemeService.update(updatedHourScheme, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (hourScheme: IHourScheme | null) => {
          if (hourScheme === null) return;

          this.location.back();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  get rows(): FormArray {
    return this.hsForm.get('rows') as FormArray;
  }

  findProject(id: Id): IProject | undefined {
    return this.projects.find((p) => p._id === id);
  }

  findMachine(id: Id): IMachine | undefined {
    return this.machines.find((m) => m._id === id);
  }
}
