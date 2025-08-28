import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ValidatorComponent } from './validator/validator.component';
import { InstructionsComponent } from './instructions/instructions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SchedulerComponent, ValidatorComponent, InstructionsComponent],
  template: `
    <div class="app-container">
      
      <main class="app-main">
        <div class="left-column">
          <app-scheduler></app-scheduler>
          <app-validator></app-validator>
        </div>
        
        <div class="right-column">
          <app-instructions></app-instructions>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./app.scss']
})
export class App {
}
