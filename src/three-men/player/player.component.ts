import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'three-men-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  @Input() public player?: Player;
  @Input() public activeTurn: boolean = false;
  @Input() public gameStarted: boolean = false;

  @Output() delete = new EventEmitter<void>();
}
