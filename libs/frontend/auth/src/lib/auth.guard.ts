import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { UserRole } from "@hour-master/shared/api";

export const authGuard = (roles?: UserRole[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentToken = authService.currentUserToken$.value;
    const currentUser = authService.currentUser$.value;
    const currentRole = currentUser?.role || null;

    if (currentToken === null) {
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
