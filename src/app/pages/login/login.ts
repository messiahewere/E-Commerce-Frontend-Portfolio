import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
            MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLogin: boolean = false;
  sucessMessage = "";
  isLoading: boolean = false;

  auth = inject(Auth);
  private _snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  router = inject(Router);
  route = inject(ActivatedRoute);

  onFormSubmit(regLog: NgForm): void {
    this.isLoading = true;

    if(this.isLogin) {
      // Logic to register a new user
      const {username, email, password} = regLog.value
      this.auth.register(username, email, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Actions to take when registration is successful
          this.sucessMessage = `Hello ${res.username}, your account has been created successfully! Please login to continue.`;
          setTimeout(() => {
            this.sucessMessage = "";
            this.cdr.detectChanges();
          }, 5000);
          
          // Reset the controls value to empty string for default state
          regLog.resetForm();

          // return to the login state for proper login
          this.isLogin = !this.isLogin;
        },
        error: (err) => {
            this.isLoading = false;
            this.cdr.detectChanges();
            this.errorMessageDisplay(err);
          }
      })
    } else {
      // Logic to login a user
        const {email, password } = regLog.value;
        this.auth.login(email, password).subscribe({
          next: (res) => {
            this.isLoading = false;
            // Actions to take when login is successful
            regLog.resetForm();
            this.auth.useToken(res.token);
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigate([returnUrl]);
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.detectChanges();
            this.errorMessageDisplay(err);
          }
         });
      
    }
  }

  errorMessageDisplay(err: any) {
    this._snackBar.open(err.error.message, 'Close', {
      duration: 3000,
    });
}

  onRegLogChange(regLog: NgForm): void {
    regLog.resetForm();
    this.isLogin = !this.isLogin;
  }

}
