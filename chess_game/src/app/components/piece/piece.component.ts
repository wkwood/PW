import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="piece-container" [ngClass]="pieceClass">
      <svg viewBox="0 0 45 45" [style.fill]="isWhite ? '#fff' : '#000'" [style.stroke]="isWhite ? '#000' : '#fff'">
        @switch (type.toLowerCase()) {
          @case ('p') {
            <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
          }
          @case ('r') {
            <path d="M9 39h27v-3H9v3zM12 36h21l-1.5-21h-18L12 36zM9 15v-6h5v4h4v-4h9v4h4v-4h5v6H9z" stroke-linecap="butt"/>
          }
          @case ('n') {
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke-linecap="butt"/><path d="M24 18c.3 1.2 1.5 2.5 3 3.5s3.5 1.5 4.5.5c1-1 0-2-2-3s-3-2.5-4.5-3.5-3.5-1.5-4.5-.5z"/><path d="M9.5 25.5A.5.5 0 1 1 9 25.5a.5.5 0 1 1 .5 0" stroke-linecap="butt"/>
          }
          @case ('b') {
            <g stroke-linecap="butt"><path d="M9 36c3.39-.47 4.11-3.11 4.44-5.25.33-2.14 1.44-3.23 1.56-5.75C15.12 22.5 13.5 20.5 13.5 17c0-6 7.5-6.5 9-10 1.5 3.5 9 4 9 10 0 3.5-1.62 5.5-1.5 8.01.12 2.51 1.23 3.61 1.56 5.75.33 2.14 1.05 4.79 4.44 5.25H9z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0M25 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0" stroke-linecap="butt"/></g>
          }
          @case ('q') {
            <g stroke-linecap="butt"><path d="M8 12c.5 1.5 1 3.5 1 5.5s-.5 4-1 5.5c1.5.5 3.5 1 5.5 1s4-.5 5.5-1c.5-1.5 1-3.5 1-5.5s-.5-4-1-5.5C17.5 11.5 15.5 11 13.5 11s-4 .5-5.5 1z"/><path d="M13.5 11V3c5 1 5 7 5 7M13.5 11V3c-5 1-5 7-5 7M28 12c.5 1.5 1 3.5 1 5.5s-.5 4-1 5.5c1.5.5 3.5 1 5.5 1s4-.5 5.5-1c.5-1.5 1-3.5 1-5.5s-.5-4-1-5.5C37.5 11.5 35.5 11 33.5 11s-4 .5-5.5 1z"/><path d="M33.5 11V3c5 1 5 7 5 7M33.5 11V3c-5 1-5 7-5 7M9 37c3.5 2 10.5 2 27 0l1.5-17H7.5L9 37z"/><path d="M13.5 11c5 0 5 7 5 7M13.5 11c-5 0-5 7-5 7M33.5 11c5 0 5 7 5 7M33.5 11c-5 0-5 7-5 7M23.5 14a1 1 0 1 1-2 0 1 1 0 1 1 2 0"/></g>
          }
          @case ('k') {
            <g stroke-linecap="butt"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="bevel"/><path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6-2.5s-4.5 0-6 2.5c-1.5 2.5 3 10 3 10"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-4-1-4s-3 3-3.5 7c0-2-1.5-2.5-1.5-2.5s-1.5-2.5-4-2.5-8 5-11 5h-1c-3 0-8.5-5-11-5s-4 2.5-4 2.5-1.5.5-1.5 2.5c-.5-4-3.5-7-3.5-7s3 3-1 4c-3 6 6 10.5 6 10.5v7z"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g>
          }
        }
      </svg>
    </div>
  `,
  styles: [`
    .piece-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    .piece-container:active {
      cursor: grabbing;
    }
    .piece-container:hover {
      transform: scale(1.1);
    }
    svg {
      width: 80%;
      height: 80%;
      stroke-width: 1.5;
    }
  `]
})
export class PieceComponent {
  @Input() type: string = '';
  @Input() color: 'w' | 'b' = 'w';

  get isWhite() {
    return this.color === 'w';
  }

  get pieceClass() {
    return `piece-${this.type}-${this.color}`;
  }
}
