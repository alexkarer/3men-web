import { AfterViewInit, Component } from '@angular/core';
//@ts-ignore
import DiceBox from "@3d-dice/dice-box";
import { Player } from './player';
import { PlayerComponent } from "./player/player.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'three-men-root',
  standalone: true,
  imports: [PlayerComponent, FormsModule],
  templateUrl: './three-men.component.html',
  styleUrl: './three-men.component.scss'
})
export class AppComponent implements AfterViewInit {

  private _diceBox?: DiceBox;
  
  public players: Player[] = [];
  public activePlayer: number = 0;
  public newPlayerName: string = '';

  public isDiceRollingDisabled: boolean = false;
  public currentGamePhase: GamePhase = GamePhase.BEFORE_GAME;
  public GamePhase = GamePhase;

  ngAfterViewInit(): void {
    this._diceBox = new DiceBox("#dice-box", {
      assetPath: "/dice-box/",
      theme: "default",
      offscreen: true,
      scale: 5
    });

    this._diceBox.init().then(() => this._diceBox.add("1d6"));
  }

  addPlayer(): void {
    this.players.push({
      id: this.players.length,
      name: this.newPlayerName,
      isThreeMen: false
    });
    this.newPlayerName = '';
  }

  deletePlayer(player: Player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  startGame(): void {
    this.activePlayer = 0;
    this.currentGamePhase = GamePhase.DETERMINE_THREE_MEN;
  }

  roll(): void {
    this.isDiceRollingDisabled = true;
    if (this.currentGamePhase === GamePhase.DETERMINE_THREE_MEN) {
      this._diceBox.roll("1d6").then((results: { value: number; }[]) => {
        if (results[0].value === 3) {
          this.players[this.activePlayer].isThreeMen = true;
        }

        this.nextPlayer();
        if (this.players[this.activePlayer].isThreeMen) {
          this.continueWithMainGame()
        }
        this.isDiceRollingDisabled = false;
      });
    } else if (this.currentGamePhase === GamePhase.MAIN_GAME) {
      this._diceBox.roll("2d6").then(() => {

      });
    }
  }

  private nextPlayer(): void {
    if (this.activePlayer + 1 >= this.players.length) {
      this.activePlayer = 0;
    } else {
      this.activePlayer += 1;
    }
  }

  private continueWithMainGame(): void {
    this.activePlayer = 0;
    this.currentGamePhase === GamePhase.MAIN_GAME;
    this._diceBox.add("1d6");
  }
}

export enum GamePhase {
  BEFORE_GAME,
  DETERMINE_THREE_MEN,
  MAIN_GAME
}