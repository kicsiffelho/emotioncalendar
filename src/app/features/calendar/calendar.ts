import { Component, OnInit, OnDestroy, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmotionsService } from '../../services/emotions';
import { Emotion } from '../../models/emotion';
import { Subscription } from 'rxjs';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  emotion?: Emotion;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentMonth = signal<Date>(new Date());
  emotions = signal<Emotion[]>([]);
  loading = signal<boolean>(false);
  selectedDay = signal<CalendarDay | null>(null);
  tooltipPosition = signal({ top: 0, left: 0 });
  showTooltipFlag = signal<boolean>(false);
  
  dateSelected = output<string>();
  
  private sub?: Subscription;

  constructor(private emotionsService: EmotionsService) {}

  calendarDays = computed((): CalendarDay[] => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = this.formatDate(currentDate);
      const emotion = this.emotions().find(e => e.date === dateStr);
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === monthIndex,
        emotion
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  });

  async ngOnInit(): Promise<void> {
    await this.loadEmotions();
    this.sub = this.emotionsService.changes$.subscribe(() => this.loadEmotions());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private async loadEmotions(): Promise<void> {
    this.loading.set(true);
    const month = this.currentMonth();
    const emotions = await this.emotionsService.getEmotionsByMonth(
      month.getFullYear(), 
      month.getMonth() + 1
    );
    this.emotions.set(emotions);
    this.loading.set(false);
  }

  previousMonth(): void {
    const newDate = new Date(this.currentMonth());
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentMonth.set(newDate);
    this.loadEmotions();
  }

  nextMonth(): void {
    const newDate = new Date(this.currentMonth());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentMonth.set(newDate);
    this.loadEmotions();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay.set(day);
    
    const dateStr = this.formatDate(day.date);
    this.dateSelected.emit(dateStr);
  }

  showTooltip(day: CalendarDay, event: MouseEvent): void {
    if (day.emotion) {
      this.selectedDay.set(day);
      this.showTooltipFlag.set(true);
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.tooltipPosition.set({
        top: rect.bottom + 5,
        left: rect.left
      });
    }
  }

  hideTooltip(): void {
    this.showTooltipFlag.set(false);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getMoodEmoji(mood: Emotion['mood']): string {
    const emojis = {
      happy: '😊',
      neutral: '😐',
      sad: '😢',
      angry: '😠',
      anxious: '😰'
    };
    return emojis[mood];
  }
}