import { AfterViewInit, Component, OnInit } from '@angular/core';
//@ts-ignore
import DiceBox from "@3d-dice/dice-box";

@Component({
  selector: 'three-men-root',
  standalone: true,
  imports: [],
  templateUrl: './three-men.component.html',
  styleUrl: './three-men.component.scss'
})
export class AppComponent implements AfterViewInit {
  
  private _diceBox?: DiceBox;
  private _diceReady = false;
  
  ngAfterViewInit(): void {
    this._diceBox = new DiceBox("#dice-box", {
      assetPath: "/dice-box/",
      theme: "default",
      offscreen: true,
      scale: 5
    });

    this._diceBox.init().then(() => this._diceReady = true);
  }

  roll(): void {
    if (this._diceReady) {
      this._diceBox.add("1d6");
    }
  }
}
