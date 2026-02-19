import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { GameInfoComponent } from './components/game-info/game-info.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ChessBoardComponent, GameInfoComponent],
    template: `
    <main class="app-container">
      <header class="app-header">
        <h1>Grandmaster<span>Chess</span></h1>
        <p>Premium Chess Experience</p>
      </header>
      
      <div class="game-layout">
        <div class="board-section">
          <app-chess-board></app-chess-board>
        </div>
        <div class="info-section">
          <app-game-info></app-game-info>
        </div>
      </div>

      <footer class="app-footer">
        <p>&copy; 2026 Grandmaster Chess Engine. Built with Angular 21.</p>
      </footer>
    </main>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .app-header {
      margin-bottom: 40px;
      text-align: center;
    }
    .app-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -1px;
      color: #fff;
    }
    .app-header h1 span {
      color: var(--primary);
    }
    .app-header p {
      color: var(--text-muted);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 4px;
    }
    .game-layout {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 40px;
      flex-grow: 1;
      align-items: flex-start;
    }
    @media (max-width: 968px) {
      .game-layout {
        grid-template-columns: 1fr;
      }
      .app-container {
        padding: 20px;
      }
    }
    .board-section {
      display: flex;
      justify-content: center;
    }
    .app-footer {
      margin-top: 40px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8rem;
    }
  `]
})
export class AppComponent { }
