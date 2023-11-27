import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export type AlertType = "success" | "info" | "warning" | "danger";

export interface Alert {
  type: AlertType;
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class AlertService {
  public alert$ = new Subject<Alert>();

  success(message: string) {
    this.alert$.next({ type: "success", message });
  }

  info(message: string) {
    this.alert$.next({ type: "info", message });
  }

  warning(message: string) {
    this.alert$.next({ type: "warning", message });
  }

  danger(message: string) {
    this.alert$.next({ type: "danger", message });
  }
}
