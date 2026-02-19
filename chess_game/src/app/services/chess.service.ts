import { Injectable } from '@angular/core';
import { Chess, Move } from 'chess.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessService {
  private game = new Chess();
  private boardSubject = new BehaviorSubject<any[][]>(this.getBoard());
  private moveHistorySubject = new BehaviorSubject<Move[]>([]);
  private turnSubject = new BehaviorSubject<'w' | 'b'>(this.game.turn());
  private isGameOverSubject = new BehaviorSubject<boolean>(false);
  private gameStatusSubject = new BehaviorSubject<string>('');

  board$ = this.boardSubject.asObservable();
  moveHistory$ = this.moveHistorySubject.asObservable();
  turn$ = this.turnSubject.asObservable();
  isGameOver$ = this.isGameOverSubject.asObservable();
  gameStatus$ = this.gameStatusSubject.asObservable();

  constructor() { }

  getBoard() {
    return this.game.board();
  }

  makeMove(move: string | { from: string; to: string; promotion?: string }): boolean {
    try {
      const result = this.game.move(move);
      if (result) {
        this.updateGameState();
        return true;
      }
    } catch (e) {
      console.error('Invalid move', e);
    }
    return false;
  }

  resetGame() {
    this.game.reset();
    this.updateGameState();
  }

  private updateGameState() {
    this.boardSubject.next(this.game.board());
    this.moveHistorySubject.next(this.game.history({ verbose: true }));
    this.turnSubject.next(this.game.turn());
    this.isGameOverSubject.next(this.game.isGameOver());
    this.gameStatusSubject.next(this.getGameStatusMessage());
  }

  private getGameStatusMessage(): string {
    if (this.game.isCheckmate()) return 'Checkmate!';
    if (this.game.isDraw()) return 'Draw!';
    if (this.game.isStalemate()) return 'Stalemate!';
    if (this.game.isThreefoldRepetition()) return 'Threefold Repetition!';
    if (this.game.isInsufficientMaterial()) return 'Insufficient Material!';
    if (this.game.isCheck()) return 'Check!';
    return '';
  }

  getLegalMoves(square?: string) {
    if (square) {
      // @ts-ignore
      return this.game.moves({ square, verbose: true });
    }
    return this.game.moves({ verbose: true });
  }

  getTurn() {
    return this.game.turn();
  }

  getFEN() {
    return this.game.fen();
  }

  /**
   * AI Logic
   */
  makeAIMove() {
    if (this.game.isGameOver()) return;

    // Simple delay for natural feel
    setTimeout(() => {
      const bestMove = this.getBestMove();
      if (bestMove) {
        this.makeMove(bestMove);
      }
    }, 500);
  }

  private getBestMove(): Move | null {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    let bestMove = null;
    let bestValue = -Infinity;

    // Shuffle moves to avoid repetitive play for same-value moves
    moves.sort(() => Math.random() - 0.5);

    for (const move of moves) {
      this.game.move(move);
      const boardValue = -this.evaluateBoard();
      this.game.undo();

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private evaluateBoard(): number {
    let totalEvaluation = 0;
    const board = this.game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation = totalEvaluation + this.getPieceValue(board[i][j]);
      }
    }
    return totalEvaluation;
  }

  private getPieceValue(piece: any): number {
    if (piece === null) return 0;

    const getAbsoluteValue = (p: any) => {
      if (p.type === 'p') return 10;
      if (p.type === 'r') return 50;
      if (p.type === 'n') return 30;
      if (p.type === 'b') return 30;
      if (p.type === 'q') return 90;
      if (p.type === 'k') return 900;
      return 0;
    };

    const absoluteValue = getAbsoluteValue(piece);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
  }
}
