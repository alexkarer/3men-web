import { AfterViewInit, Component } from '@angular/core';
//@ts-ignore
import DiceBox from "@3d-dice/dice-box";
import { Player } from './player';
import { PlayerComponent } from "./player/player.component";
import { FormsModule } from '@angular/forms';
import { ThreeMenToast, ToastsWrapperComponent } from './toasts-wrapper/toasts-wrapper.component';

@Component({
  selector: 'three-men-root',
  standalone: true,
  imports: [PlayerComponent, FormsModule, ToastsWrapperComponent],
  templateUrl: './three-men.component.html',
  styleUrl: './three-men.component.scss'
})
export class AppComponent implements AfterViewInit {

  private _diceBox?: DiceBox;
  
  players: Player[] = [];
  activePlayer: number = -1;
  newPlayerName: string = '';

  isDiceRollingDisabled: boolean = false;
  currentGamePhase: GamePhase = GamePhase.BEFORE_GAME;

  currentToast?: ThreeMenToast = undefined;

  ngAfterViewInit(): void {
    this._diceBox = new DiceBox("#dice-box", {
      assetPath: "./dice-box/",
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

  resetGame(): void {
    this.activePlayer = -1;
    this.currentGamePhase = GamePhase.BEFORE_GAME;
    this.players.forEach(p => {
      p.isThreeMen = false;
      p.hasTakenTurnInMainGame = false;
    })
    this.isDiceRollingDisabled = false;
  }

  get GamePhaseText(): string {
    switch (this.currentGamePhase) {
      case GamePhase.BEFORE_GAME: return 'Pre Game';
      case GamePhase.DETERMINE_THREE_MEN: return 'Determening 3-Men, ' + this.players[this.activePlayer].name + "'s Turn";
      case GamePhase.MAIN_GAME: return 'Main Game, ' + this.players[this.activePlayer].name + "'s Turn";
    }
  }

  private handleThreeMenDetRoll(results: { value: number; }[]): void {
    if (results[0].value === 3) {
      this.players[this.activePlayer].isThreeMen = true;
      this.showToastMessage('3-Men', this.players[this.activePlayer].name + ' is a 3-Men!');
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
      this.showToastMessage('3-Men!', 'All 3-Men Drink.');
    } else if ((results[0].value === 1 && results[1].value === 4) || (results[0].value === 4 && results[1].value === 1)) {
      this.showToastMessage('Thumb Master!', 'All thumbs to the table, slowest needs to drink.');
    } else if ((results[0].value === 4 && results[1].value === 6) || (results[0].value === 6 && results[1].value === 4)) {
      this.showToastMessage('Invent a rule!', 'Invent a rule that all players have to follow until the game ends.');
    } else if (results[0].value === results[1].value) {
      if (threeMenNeedToDrink) {
        this.showToastMessage('Doubles + 3-Men!', 'Distribute sips equal to dice value and all 3-Men drink twice.');
      } else {
        this.showToastMessage('Doubles!', 'Distribute sips equal to dice value.');
      }
    } else if (results[0].value + results[1].value === 7) {
      if (threeMenNeedToDrink) {
        this.showToastMessage('Left neighbor + 3-Men!', 'The player sitting to the left of the roller and all 3-Men drink need to drink.');
      } else {
        this.showToastMessage('Left neighbor', 'The player sitting to the left of the roller needs to drink.');
      }
    } else if (results[0].value + results[1].value === 9) {
      if (threeMenNeedToDrink) {
        this.showToastMessage('Right neighbor + 3-Men!', 'The player sitting to the right of the roller and all 3-Men drink need to drink.');
      } else {
        this.showToastMessage('Right neighbor', 'The player sitting to the right of the roller needs to drink.');
      }
    } else {
      if (threeMenNeedToDrink) {
        this.showToastMessage('3-Men!', 'All 3-Men drink.');
      } else {
        this.players[this.activePlayer].hasTakenTurnInMainGame = true;
        this.nextPlayer();
        if (this.players[this.activePlayer].hasTakenTurnInMainGame) {
          this.showToastMessage('Game Over!', 'Thanks for playing!');
          this.resetGame();
        } else {
          this.showToastMessage('Nothing!', this.players[this.activePlayer].name + ' takes their turn.');
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
    this.showToastMessage('Main Game Start!', 'Get your Drinks ready.');
  }

  private showToastMessage(header: string, text: string): void {
    this.currentToast = {
      header: header,
      text: text
    }
  }
}

export enum GamePhase {
  BEFORE_GAME,
  DETERMINE_THREE_MEN,
  MAIN_GAME
}