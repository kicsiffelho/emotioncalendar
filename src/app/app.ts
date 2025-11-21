import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './features/calendar/calendar';
import { EmotionFormComponent } from './features/emotion-form/emotion-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalendarComponent, EmotionFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  activeTab = signal<'calendar' | 'emotions'>('calendar');
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  
  setActiveTab(tab: 'calendar' | 'emotions', date?: string): void {
    this.activeTab.set(tab);
    if (date) {
      this.selectedDate.set(date);
    }
  }
  
  isActiveTab(tab: 'calendar' | 'emotions'): boolean {
    return this.activeTab() === tab;
  }
}