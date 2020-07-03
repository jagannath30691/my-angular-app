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
    this.paginationSize = 5;
  }

  getPageByNumber(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getPage('Page');
  }

  changePagination(type: string) {
    let paginationList = this.paginationList.map(i => {
      return (type === 'Next') ? i + 5 : i - 5;
    }).filter(j => {
      return (j >= 1 && j <= this.totalPages);
    });
    if (this.totalPages >= 5) {
      if (paginationList.length < 5 && paginationList[paginationList.length - 1] === this.totalPages) {
        paginationList = [];
        for (let i = 1; i <= 5; i++) {
          paginationList.push(this.totalPages - 5 + i);
        }
      }
      if (paginationList.length < 5 && paginationList[0] === 1) {
        paginationList = [];
        for (let i = 1; i <= 5; i++) {
          paginationList.push(i);
        }
      }
    }
    this.paginationList = paginationList;
  }

  getPage(type: string) {
    if (type === 'First') {
      this.pageNumber = 1;
      this.paginationList = [1, 2, 3, 4, 5];
    }
    this.makePageApiRequest();
  }

  makePageApiRequest() {
    const payload = {
      phoneNumber: this.phoneNumber.toString()
    };
    const pageNumber = this.pageNumber;
    const pageSize = this.limit;
    const endPoint = `${calculateEndpoint}?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`;
    this.apiAccess.postRequest(endPoint, payload).subscribe(result => {
      this.currentPageCombinations = result.phoneNbrs;
      this.combinationsCount = result.totalCount;
      this.totalPages = result.totalPages;
      this.previousPage = result.previous ? (result.previous.pageNumber + 1) : this.previousPage;
      this.nextPage = result.next ? (result.next.pageNumber + 1) : this.nextPage;
      this.firstShownRecordNumber = (this.pageNumber * this.limit) - this.limit + 1;
      this.lastShownRecordNumber = (result.phoneNbrs.length === this.limit) ? (this.pageNumber * this.limit) : ((this.pageNumber * this.limit) - this.limit + result.phoneNbrs.length);
    });
  }

  generateSamplesOfInput() {
    this.inputErrors = false;
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
