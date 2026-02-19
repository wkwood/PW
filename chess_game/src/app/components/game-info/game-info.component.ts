import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessService } from '../../services/chess.service';

@Component({
    selector: 'app-game-info',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="game-info premium-glass p-6">
      <div class="status-header mb-6">
        <div class="turn-indicator" [class.black]="(turn$ | async) === 'b'">
          <div class="indicator-dot"></div>
          <span>{{ (turn$ | async) === 'w' ? "White's Turn" : "Black's Turn" }}</span>
        </div>
        <div class="game-status" *ngIf="status$ | async as status">
          {{ status }}
        </div>
      </div>

      <div class="stats-grid mb-6">
        <div class="stat-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
          <div class="stat-content">
            <span class="label">Moves</span>
            <span class="value">{{ (history$ | async)?.length || 0 }}</span>
          </div>
        </div>
        <div class="stat-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          <div class="stat-content">
            <span class="label">Status</span>
            <span class="value">{{ (isGameOver$ | async) ? 'Finished' : 'Live' }}</span>
          </div>
        </div>
      </div>

      <div class="history-container">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Move History
        </h3>
        <div class="history-list custom-scrollbar">
          <div class="history-item" *ngFor="let move of (history$ | async); let i = index">
            <span class="move-index">{{ i + 1 }}.</span>
            <span class="move-val">{{ move.san }}</span>
          </div>
          <div *ngIf="(history$ | async)?.length === 0" class="text-muted text-xs italic p-2">
            No moves yet
          </div>
        </div>
      </div>

      <div class="actions mt-6">
        <button class="btn-primary w-full flex items-center justify-center gap-2" (click)="reset()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          Reset Game
        </button>
      </div>
    </div>
  `,
    styles: [`
    .game-info {
      height: 100%;
      display: flex;
      flex-direction: column;
      min-width: 300px;
    }
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .turn-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #fff;
    }
    .indicator-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }
    .turn-indicator.black .indicator-dot {
      background-color: #333;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .game-status {
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .stat-content .label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-content .value {
      font-weight: 700;
      font-size: 1.1rem;
      color: #fff;
    }
    .history-container {
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .history-list {
      flex-grow: 1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding-right: 8px;
    }
    .history-item {
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.9rem;
      display: flex;
      gap: 8px;
    }
    .move-index {
      color: var(--text-muted);
      font-weight: 500;
      width: 20px;
    }
    .move-val {
      font-weight: 600;
      color: var(--primary);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--glass-border);
      border-radius: 10px;
    }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .gap-2 { gap: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-6 { margin-bottom: 24px; }
    .mt-6 { margin-top: 24px; }
    .p-6 { padding: 24px; }
    .text-sm { font-size: 0.875rem; }
    .font-semibold { font-weight: 600; }
    .text-muted { color: var(--text-muted); }
    .p-2 { padding: 8px; }
  `]
})
export class GameInfoComponent {
    private chessService = inject(ChessService);

    turn$ = this.chessService.turn$;
    history$ = this.chessService.moveHistory$;
    status$ = this.chessService.gameStatus$;
    isGameOver$ = this.chessService.isGameOver$;

    reset() {
        this.chessService.resetGame();
    }
}
