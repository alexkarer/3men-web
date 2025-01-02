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
  public activePlayer: number = -1;
  public newPlayerName: string = '';

  public isDiceRollingDisabled: boolean = false;
  public currentGamePhase: GamePhase = GamePhase.BEFORE_GAME;

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
      isThreeMen: false,
      hasTakenTurnInMainGame: false
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

  hasGameStarted(): boolean {
    return this.currentGamePhase !== GamePhase.BEFORE_GAME;
  }

  roll(): void {
    this.isDiceRollingDisabled = true;
    if (this.currentGamePhase === GamePhase.DETERMINE_THREE_MEN) {
      this._diceBox.roll("1d6").then((results: { value: number; }[]) => this.handleThreeMenDetRoll(results));
    } else if (this.currentGamePhase === GamePhase.MAIN_GAME) {
      this._diceBox.roll("2d6").then((results: { value: number; }[]) => this.handleMainGameRoll(results));
    }
  }

  private handleThreeMenDetRoll(results: { value: number; }[]): void {
    if (results[0].value === 3) {
      this.players[this.activePlayer].isThreeMen = true;
    }

    this.nextPlayer();
    if (this.players[this.activePlayer].isThreeMen) {
      this.continueWithMainGame()
    } else {
      this.isDiceRollingDisabled = false;
    }
  }

  private handleMainGameRoll(results: { value: number; }[]): void {
    let threeMenNeedToDrink = false;
    if (results[0].value === 3 || results[1].value === 3) {
      threeMenNeedToDrink = true;
    }

    if ((results[0].value === 1 && results[1].value === 2) || (results[0].value === 2 && results[1].value === 1)) {
      // all three men need to drink
    } else if ((results[0].value === 1 && results[1].value === 4) || (results[0].value === 4 && results[1].value === 1)) {
      // thumb master
    } else if ((results[0].value === 4 && results[1].value === 6) || (results[0].value === 6 && results[1].value === 4)) {
      // invent a rule
    } else if (results[0].value === results[1].value) {
      // distribute sips equal to dice value
    } else if (results[0].value + results[1].value === 7) {
      //  The player sitting to the left of the roller needs to drin
    } else if (results[0].value + results[1].value === 9) {
      //  The player sitting to the left of the roller needs to drin
    } else {
      if (!threeMenNeedToDrink) {
        this.players[this.activePlayer].hasTakenTurnInMainGame = true;
        this.nextPlayer();
        if (this.players[this.activePlayer].hasTakenTurnInMainGame) {
          this.resetGame();
        }
      }
    }

    this.isDiceRollingDisabled = false;
  }

  private nextPlayer(): void {
    if (this.activePlayer + 1 >= this.players.length) {
      this.activePlayer = 0;
    } else {
      this.activePlayer += 1;
    }
  }

  private continueWithMainGame(): void {
    this.currentGamePhase = GamePhase.MAIN_GAME;
    this._diceBox.add("1d6").then(() => this.isDiceRollingDisabled = false);
  }

  private resetGame(): void {
    this.activePlayer = -1;
    this.currentGamePhase = GamePhase.BEFORE_GAME;
    this.players.forEach(p => {
      p.isThreeMen = false;
      p.hasTakenTurnInMainGame = false;
    })
    this.isDiceRollingDisabled = false;
  }
}

export enum GamePhase {
  BEFORE_GAME,
  DETERMINE_THREE_MEN,
  MAIN_GAME
}