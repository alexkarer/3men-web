import { Component, Input } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'three-men-toasts-wrapper',
  standalone: true,
  imports: [NgbToastModule],
  templateUrl: './toasts-wrapper.component.html',
  styleUrl: './toasts-wrapper.component.scss',
  host: { class: 'toast-container position-fixed top-0 start-50 translate-middle-x p-3', style: 'z-index: 1200' },
})
export class ToastsWrapperComponent {

  toasts: ThreeMenToast[] = [];

  @Input() set toast(toast: ThreeMenToast | undefined) {
    if (toast !== undefined) {
      this.toasts.push(toast);
    }
  }

  remove(toast: ThreeMenToast): void {
    this.toasts.filter(t => t !== toast);
  }
}

export type ThreeMenToast = {
  header: string, 
  text: string
}