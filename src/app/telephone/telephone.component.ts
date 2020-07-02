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
  inputErrors: boolean;
  errorMessage: string;
  currentPageCombinations: Array<string>;
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
    this.limit = 100;
    this.combinationsCount = 0;
    this.currentPageCombinations = [];
    this.pageNumber = 1;
    this.totalPages = 0;
    this.previousPage = 0;
    this.nextPage = 0;
    this.paginationList = [1, 2, 3, 4, 5];
    this.paginationSize = 5;
  }

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
      this.previousPage = result.previous ? result.previous.pageNumber: this.previousPage;
      this.nextPage = result.next ? result.next.pageNumber : this.nextPage;
      this.firstShownRecordNumber = (this.pageNumber * this.limit) - this.limit + 1
      this.lastShownRecordNumber = (this.pageNumber * this.limit);
    });
  }

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
  }
  constructor(private apiAccess: ApiAccessService) { }
}
