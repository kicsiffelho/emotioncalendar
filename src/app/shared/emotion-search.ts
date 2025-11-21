import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appEmotionSearch]',
  standalone: true
})
export class EmotionSearchDirective {
  emotionSearch = output<string>();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.emotionSearch.emit(value);
  }

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.emotionSearch.emit(value);
  }
}