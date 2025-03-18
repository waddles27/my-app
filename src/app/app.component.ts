import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
   
],
  templateUrl: './app.component.html',
  host: {
    class: 'app-root'
  }
})
export class AppComponent {

}
