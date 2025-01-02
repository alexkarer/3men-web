import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../player';

@Component({
  selector: 'three-men-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  private _activeTurn: boolean = false;

  @Input() public player?: Player;

  @Input() set activeTurn(value: boolean) {
    if (this._activeTurn === true && value === false) {
      this.turnFinished = true;
    }

    this._activeTurn = value;
  }

  public get activeTurn(): boolean {
    return this._activeTurn;
  }

  @Output() delete = new EventEmitter<void>();

  public turnFinished: boolean = false;
}
