import { Injectable } from '@angular/core';
import { Emotion } from '../models/emotion';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmotionsService {
  private readonly LS_KEY = 'emotion-calendar-data';
  private _changes = new Subject<void>();
  changes$ = this._changes.asObservable();

  async getAll(): Promise<Emotion[]> {
    const cached = localStorage.getItem(this.LS_KEY);
    if (cached) {
      const emotions = JSON.parse(cached) as Emotion[];
      return emotions.map(e => ({
        ...e,
        createdAt: new Date(e.createdAt)
      }));
    }
    return [];
  }

  private saveAll(emotions: Emotion[]): void {
    localStorage.setItem(this.LS_KEY, JSON.stringify(emotions));
    this._changes.next();
  }

  async add(emotion: Omit<Emotion, 'id' | 'createdAt'>): Promise<Emotion> {
    const emotions = await this.getAll();
    const nextId = emotions.length ? Math.max(...emotions.map(e => e.id)) + 1 : 1;
    const newEmotion: Emotion = {
      ...emotion,
      id: nextId,
      createdAt: new Date()
    };
    this.saveAll([...emotions, newEmotion]);
    return newEmotion;
  }

  async update(id: number, updates: Partial<Emotion>): Promise<Emotion | undefined> {
    const emotions = await this.getAll();
    const updated = emotions.map(e => e.id === id ? { ...e, ...updates } : e);
    this.saveAll(updated);
    return updated.find(e => e.id === id);
  }

  async remove(id: number): Promise<void> {
    const emotions = await this.getAll();
    this.saveAll(emotions.filter(e => e.id !== id));
  }

  async getEmotionForDate(date: string): Promise<Emotion | undefined> {
    const emotions = await this.getAll();
    return emotions.find(e => e.date === date);
  }

  async getEmotionsByMonth(year: number, month: number): Promise<Emotion[]> {
    const emotions = await this.getAll();
    return emotions.filter(e => {
      const [eYear, eMonth] = e.date.split('-').map(Number);
      return eYear === year && eMonth === month;
    });
  }
}