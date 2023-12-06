import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { UserRole } from "@hour-master/shared/api";

export const authGuard = (roles?: UserRole[]) => {
  return () => {
    console.log('authGuard');
    const authService = inject(AuthService);
    const router = inject(Router);

    // No use of pre-stored user, because auth guard lives in own scope
    // and does not have the same auth service instance as the app component
    const currentUser = authService.getUserFromLocalStorageSync();
    const currentRole = currentUser?.role || null;

    if (currentUser === null) {
      return router.navigate(['/auth/login']);
    }

    if(roles) {
      if (!currentRole) {
        return router.navigate(['/auth/login']);
      }

      if (currentRole && !roles.includes(currentRole)) {
        return router.navigate(['/auth/login']);
      }
    }

    return true;
  }
}
