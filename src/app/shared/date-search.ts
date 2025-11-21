import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appDateSearch]',
  standalone: true
})
export class DateSearchDirective {
  dateSearch = output<string>();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dateSearch.emit(value);
  }

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dateSearch.emit(value);
  }
}