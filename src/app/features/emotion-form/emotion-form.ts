import { Component, OnInit, OnDestroy, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmotionsService } from '../../services/emotions';
import { Emotion } from '../../models/emotion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emotion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emotion-form.html',
  styleUrls: ['./emotion-form.css']
})
export class EmotionFormComponent implements OnInit, OnDestroy {
  selectedDate = input<string>('');
  
  emotions = signal<Emotion[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  editingEmotion = signal<Emotion | null>(null);
  
  newEmotion = {
    date: this.getTodayDateString(),
    mood: 'neutral' as Emotion['mood'],
    notes: ''
  };

  private sub?: Subscription;

  constructor(private emotionsService: EmotionsService) {}

  async ngOnInit(): Promise<void> {
    await this.loadEmotions();
    this.sub = this.emotionsService.changes$.subscribe(() => this.loadEmotions());
    
    const initialDate = this.selectedDate();
    if (initialDate) {
      await this.setupFormForDate(initialDate);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private async loadEmotions(): Promise<void> {
    this.loading.set(true);
    const emotions = await this.emotionsService.getAll();
    emotions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.emotions.set(emotions);
    this.loading.set(false);
  }

  private async setupFormForDate(date: string): Promise<void> {
    const emotion = await this.emotionsService.getEmotionForDate(date);
    if (emotion) {
      this.editingEmotion.set(emotion);
      this.newEmotion.date = emotion.date;
      this.newEmotion.mood = emotion.mood;
      this.newEmotion.notes = emotion.notes || '';
    } else {
      this.editingEmotion.set(null);
      this.newEmotion.date = date;
      this.newEmotion.mood = 'neutral';
      this.newEmotion.notes = '';
    }
  }

  async ngOnChanges(): Promise<void> {
    const date = this.selectedDate();
    if (date) {
      await this.setupFormForDate(date);
    }
  }

  private resetForm(): void {
    this.newEmotion = {
      date: this.getTodayDateString(),
      mood: 'neutral',
      notes: ''
    };
  }

  async submit(): Promise<void> {
    if (!this.newEmotion.date || !this.newEmotion.mood) {
      return;
    }

    this.saving.set(true);
    try {
      if (this.editingEmotion()) {
        await this.emotionsService.update(this.editingEmotion()!.id, {
          date: this.newEmotion.date,
          mood: this.newEmotion.mood,
          notes: this.newEmotion.notes
        });
      } else {
        await this.emotionsService.add(this.newEmotion);
      }
      
      this.resetForm();
      this.editingEmotion.set(null);
      
    } catch (error) {
      console.error('Error saving emotion:', error);
    } finally {
      this.saving.set(false);
    }
  }

  editEmotion(emotion: Emotion): void {
    this.editingEmotion.set(emotion);
    this.newEmotion.date = emotion.date;
    this.newEmotion.mood = emotion.mood;
    this.newEmotion.notes = emotion.notes || '';
  }

  async deleteEmotion(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this emotion?')) {
      await this.emotionsService.remove(id);
      if (this.editingEmotion()?.id === id) {
        this.resetForm();
        this.editingEmotion.set(null);
      }
    }
  }
}