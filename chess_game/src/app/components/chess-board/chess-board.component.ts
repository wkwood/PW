import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessService } from '../../services/chess.service';
import { PieceComponent } from '../piece/piece.component';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  templateUrl: './chess-board.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .board-container {
      position: relative;
      width: 100%;
      padding-top: 100%; /* Aspect ratio 1:1 */
      box-shadow: var(--shadow-lg);
      border-radius: 8px;
      overflow: hidden;
      border: 8px solid var(--bg-card);
    }
    .board-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
    }
    .square {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s ease;
    }
    .square.light { background-color: var(--board-light); }
    .square.dark { background-color: var(--board-dark); }
    
    .square.highlighted::after {
      content: '';
      position: absolute;
      width: 25%;
      height: 25%;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }
    .square.can-capture::after {
      content: '';
      position: absolute;
      width: 90%;
      height: 90%;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }
    
    .square.selected {
      background-color: var(--board-highlight) !important;
    }
    
    .coordinate {
      position: absolute;
      font-size: 10px;
      font-weight: 700;
      pointer-events: none;
    }
    .file { bottom: 2px; right: 2px; }
    .rank { top: 2px; left: 2px; }
    .square.light .coordinate { color: var(--board-dark); }
    .square.dark .coordinate { color: var(--board-light); }

    .dragging-over {
      background-color: var(--board-highlight) !important;
    }
  `]
})
export class ChessBoardComponent implements OnInit {
  private chessService = inject(ChessService);
  private destroyRef = inject(DestroyRef);

  board$: Observable<any[][]> = this.chessService.board$;
  selectedSquare: string | null = null;
  legalMoves: any[] = [];

  ngOnInit(): void {
    this.chessService.turn$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(turn => {
      if (turn === 'b') {
        this.chessService.makeAIMove();
      }
    });
  }

  getSquareName(row: number, col: number): string {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  }

  isLightSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }

  onSquareClick(row: number, col: number) {
    const square = this.getSquareName(row, col);

    if (this.selectedSquare === square) {
      this.selectedSquare = null;
      this.legalMoves = [];
      return;
    }

    const piece = this.chessService.getBoard()[row][col];

    if (this.selectedSquare) {
      const move = this.legalMoves.find(m => m.to === square);
      if (move) {
        this.chessService.makeMove({
          from: this.selectedSquare,
          to: square,
          promotion: 'q'
        });
        this.selectedSquare = null;
        this.legalMoves = [];
        return;
      }
    }

    const turn = this.chessService.getTurn();
    if (piece && piece.color === turn) {
      this.selectedSquare = square;
      this.legalMoves = this.chessService.getLegalMoves(square);
    } else {
      this.selectedSquare = null;
      this.legalMoves = [];
    }
  }

  isHighlighted(row: number, col: number): boolean {
    const square = this.getSquareName(row, col);
    return this.legalMoves.some(m => m.to === square);
  }

  isCaptureMove(row: number, col: number): boolean {
    const square = this.getSquareName(row, col);
    const move = this.legalMoves.find(m => m.to === square);
    return move && (move.flags.includes('c') || move.flags.includes('e'));
  }
}
