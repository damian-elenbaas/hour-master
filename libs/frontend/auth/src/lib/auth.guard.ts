import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

// BUG: NullInjectorError: No provider for HTTP Client? Cirular dependency with AuthService?
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(`authGuard called`);
  if(authService.currentUserToken$.value !== null) {
    return true;
  }

  return router.navigate(['/auth/login']);
}
