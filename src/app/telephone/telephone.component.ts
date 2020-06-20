import { Component, OnInit } from '@angular/core';
import { ApiAccessService } from '../services/api-access.service';

const calculateEndpoint = '/calculator/calculate';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {

  phoneNumber: number;
  combinations: Array<string>;
  inputErrors: boolean;
  errorMessage: string;
  currentPageCombinations: Array<string>;
  offset: number;
  limit: number;
  combinationsCount: number;
  firstShownRecordNumber: number;
  lastShownRecordNumber: number;

  ngOnInit() {
    this.inputErrors = false;
    this.errorMessage = '';
    this.offset = 1;
    this.limit = 100;
    this.combinations = [];
    this.combinationsCount = 0;
  }

  getPage(type: string) {
    if (type === 'Next') {
      console.log('type', type);
      if (this.offset + this.limit < this.combinationsCount) {
        this.offset = this.offset + this.limit;
      }
    }
    if (type === 'Previous') {
      console.log('type', type);
      const nextOffset = this.offset - this.limit;
      this.offset = (nextOffset >= 1) ? nextOffset : 1;
    }
    console.log('offset', this.offset);
    this.currentPageCombinations = this.getPageCombinations();
    console.log('currentPageCombinations', this.currentPageCombinations);
  }

  getPageCombinations() {
    let lastIndex = this.offset + this.limit - 1;
    const computingOffset = this.offset;
    if (this.combinationsCount < this.offset + this.limit - 1) {
      lastIndex = this.combinationsCount;
    }
    this.firstShownRecordNumber = computingOffset;
    this.lastShownRecordNumber = lastIndex;
    return this.combinations.slice(computingOffset - 1, lastIndex);
  }

  generateSamplesOfInput() {
    this.inputErrors = false;
    this.combinations = [];
    if (!this.phoneNumber) {
      this.inputErrors = true;
      this.errorMessage = 'input should not be empty. It should be 7 to 10 digit long';
      return;
    }
    const numLen = this.phoneNumber.toString().length;
    if (numLen < 7) {
      this.inputErrors = true;
      this.errorMessage = 'input should be atleast 7 digit';
      return;
    }
    if (numLen > 10) {
      this.inputErrors = true;
      this.errorMessage = 'input should be less than 10 digit';
      return;
    }
    if (numLen >= 7 && numLen <= 10) {
      const payload = {
        phoneNumber: this.phoneNumber.toString()
      };
      this.apiAccess.postRequest(calculateEndpoint, payload).subscribe(result => {
        this.combinations = result.phoneNbrs;      
        this.combinationsCount = this.combinations.length;
        this.offset = 1;
        this.currentPageCombinations = this.getPageCombinations();
      });
    }
  }
  constructor(private apiAccess: ApiAccessService) { }
}
