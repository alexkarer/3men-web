# 3men

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

This is a web implementation of the Drinking game "3-Men"

## 3-Men Rules

In the Initial Phase of the game all players take turns in a row and roll a dice. As soon as the first player rolls a "3" they are a 3-Men and every other player has to roll a dice one additional time and if they roll a "3" they are also a 3-Men.

After the Initial phase the proper game beginns and all players take turns rolling 2 Dice and depending on their Result a certain action happens. They then repeat the process until they get a no result. The possible results are the following:

| Result | Action |
| ------ | ------ |
| "1" and "2" or any dice is a "3" | All 3-Men need to drink |
| any double | distribute sips to other people equal to the number in the doubles |
| "1" and "4" | **Thumb Master:** The player who puts their thumb last on the table needs to drink |
| dice total are equal to 7 | The player sitting to the left of the roller needs to drink |
| dice total are equal to 9 | The player sitting to the right of the roller needs to drink|
| "4" and "6" | the roller can invent a custom rule that is valid for the rest of the game |
| none of the above | if none of the above match no action happens and the next player can take their turn |

After each player took one turn the game is over.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deployment

This application is deployed using Github Pages, which is currently done manually, to deploy run the following command:
`ng deploy --base-href=/3men-web/ --repo=https://github.com/alexkarer/3men-web`