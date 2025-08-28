import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  isCollapsed: boolean = false;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
