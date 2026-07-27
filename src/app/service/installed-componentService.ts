import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstalledComponentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/installed-components`;

  registerInstallation(datesForm: any) {
    return this.http.post(this.apiUrl, datesForm)
  }
}
