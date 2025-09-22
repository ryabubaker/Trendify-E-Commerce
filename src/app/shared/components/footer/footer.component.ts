import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';


@Component({
  selector: 'app-footer',
  imports: [AccordionModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
