import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {

  constructor() { }
  phoneNumber: number;
  combinations: Array<string>;
  numAlphaComb = [
    [],
    [],
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I'],
    ['J', 'K', 'L'],
    ['M', 'N', 'O'],
    ['P', 'Q', 'R', 'S'],
    ['T', 'U', 'V'],
    ['W', 'X', 'Y', 'Z'],
  ];
  
  ngOnInit() { }

  generateSamplesOfInput() {
    this.combinations = [];
    if (this.phoneNumber) {
      const numLen = this.phoneNumber.toString().length;
      if (numLen >= 7 && numLen <= 10) {
        const numStrAry = this.phoneNumber.toString().split('');
        const lastDigit = numStrAry.splice(numStrAry.length - 1, 1);
        const combList = [];
        for (const char of this.numAlphaComb[Number(lastDigit[0])]) {
          combList.push(numStrAry.concat(char).join(''));
        }
        console.log('combList', combList);
        this.combinations = combList;
      }
    }
  }
}
