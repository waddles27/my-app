import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-secured-area',
  imports: [
      RouterOutlet,
      MatToolbarModule,
      MatButtonModule,
      MatMenuModule
  ],
  templateUrl: './secured-area.component.html',
  styleUrl: './secured-area.component.scss'
})
export class SecuredAreaComponent {

    public readonly authService = inject(AuthService);
}
