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
  // combinations: Array<string>;
  inputErrors: boolean;
  errorMessage: string;
  currentPageCombinations: Array<string>;
  // offset: number;
  limit: number;
  combinationsCount: number;
  firstShownRecordNumber: number;
  lastShownRecordNumber: number;
  pageNumber: number;
  totalPages: number;
  nextPage: number;
  previousPage: number;
  paginationList: Array<number>;
  paginationSize: number;

  ngOnInit() {
    this.inputErrors = false;
    this.errorMessage = '';
    // this.offset = 1;
    this.limit = 100;
    // this.combinations = [];
    this.combinationsCount = 0;
    this.currentPageCombinations = [];
    this.pageNumber = 1;
    this.totalPages = 0;
    this.previousPage = 0;
    this.nextPage = 0;
    this.paginationList = [1, 2, 3, 4, 5];
    this.paginationSize = 5;
  }

  // getPage(type: string) {
  //   if (type === 'Next') {
  //     console.log('type', type);
  //     if (this.offset + this.limit < this.combinationsCount) {
  //       this.offset = this.offset + this.limit;
  //     }
  //   }
  //   if (type === 'Previous') {
  //     console.log('type', type);
  //     const nextOffset = this.offset - this.limit;
  //     this.offset = (nextOffset >= 1) ? nextOffset : 1;
  //   }
  //   console.log('offset', this.offset);
  //   this.currentPageCombinations = this.getPageCombinations();
  //   console.log('currentPageCombinations', this.currentPageCombinations);
  // }

  getPageByNumber(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getPage('Page');
  }

  getPage(type: string) {
    if (type === 'First') {
      this.pageNumber = 1;
    }
    if (type === 'Next') {
      this.pageNumber = (this.nextPage > this.totalPages) ? this.totalPages : this.nextPage;
    }
    if (type === 'Previous') {
      this.pageNumber = (this.previousPage <= 0) ? 1 : this.previousPage;
    }
    if (['Next', 'Previous'].includes(type)) {
      this.changePagination(type);
    }
    this.makePageApiRequest();
  }

  changePagination(type: string) {
    const paginationList = [];
    console.log('page', this.pageNumber);
    let i = this.pageNumber;
    const j = i + this.paginationSize - 1;
    while(i <= j) {
      paginationList.push(i);      
      i++;
    }
    this.paginationList = paginationList;
  }

  makePageApiRequest() {
    const payload = {
      phoneNumber: this.phoneNumber.toString()
    };
    const pageNumber = this.pageNumber;
    const pageSize = this.limit;
    const endPoint = `${calculateEndpoint}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    this.apiAccess.postRequest(endPoint, payload).subscribe(result => {
      this.currentPageCombinations = result.phoneNbrs;
      this.combinationsCount = result.totalCount;
      this.totalPages = result.totalPages;
      this.previousPage = result.previous.pageNumber;
      this.nextPage = result.next.pageNumber;
      this.firstShownRecordNumber = (this.pageNumber * this.limit) - this.limit + 1
      this.lastShownRecordNumber = (this.pageNumber * this.limit);
    });
  }

  // getPageCombinations() {
  //   let lastIndex = this.offset + this.limit - 1;
  //   const computingOffset = this.offset;
  //   if (this.combinationsCount < this.offset + this.limit - 1) {
  //     lastIndex = this.combinationsCount;
  //   }
  //   this.firstShownRecordNumber = computingOffset;
  //   this.lastShownRecordNumber = lastIndex;
  //   return this.combinations.slice(computingOffset - 1, lastIndex);
  // }

  generateSamplesOfInput() {
    this.inputErrors = false;
    // this.combinations = [];
    if (!this.phoneNumber) {
      this.inputErrors = true;
      this.errorMessage = 'input should not be empty. It should be 7 or 10 digit long';
      return;
    }
    const numLen = this.phoneNumber.toString().length;
    if (!([7, 10].includes(numLen))) {
      this.inputErrors = true;
      this.errorMessage = 'input should be either 7 digit or 10 digit long';
      return;
    }
    this.getPage('First');
    // this.apiAccess.postRequest(endPoint, payload).subscribe(result => {
    //   this.combinations = result.phoneNbrs;      
    //   this.combinationsCount = result.totalCount;
    //   this.totalPages = result.totalPages;
    //   // this.offset = 1;
    //   // this.currentPageCombinations = this.getPageCombinations();
    // });
  }
  constructor(private apiAccess: ApiAccessService) { }
}
