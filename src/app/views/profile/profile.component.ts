import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  user = this.auth.user.asReadonly();

  loadingProfile = signal(false);
  loadingPassword = signal(false);
  profileSuccess = signal('');
  profileError = signal('');
  passwordSuccess = signal('');
  passwordError = signal('');

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }]
  });

  passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loadingProfile.set(true);
    this.profileError.set('');
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.loadingProfile.set(false);
      },
      error: () => {
        this.profileError.set('Error al cargar el perfil');
        this.loadingProfile.set(false);
      }
    });
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;

    this.loadingProfile.set(true);
    this.profileSuccess.set('');
    this.profileError.set('');

    this.auth.updateProfile({
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName
    }).subscribe({
      next: () => {
        this.profileSuccess.set('Datos actualizados correctamente');
        this.loadingProfile.set(false);
        setTimeout(() => this.profileSuccess.set(''), 3000);
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Error al actualizar';
        this.profileError.set(typeof msg === 'string' ? msg : 'Error al actualizar');
        this.loadingProfile.set(false);
      }
    });
  }

  onUpdatePassword() {
    if (this.passwordForm.invalid) return;

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.passwordError.set('Las contrasenas no coinciden');
      return;
    }

    this.loadingPassword.set(true);
    this.passwordSuccess.set('');
    this.passwordError.set('');

    this.auth.changePassword({
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    }).subscribe({
      next: () => {
        this.passwordSuccess.set('Contrasena actualizada correctamente');
        this.passwordForm.reset();
        this.loadingPassword.set(false);
        setTimeout(() => this.passwordSuccess.set(''), 3000);
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Error al cambiar contrasena';
        this.passwordError.set(typeof msg === 'string' ? msg : 'Error al cambiar contrasena');
        this.loadingPassword.set(false);
      }
    });
  }
}
