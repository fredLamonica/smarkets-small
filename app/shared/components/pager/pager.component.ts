import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent implements OnInit, OnChanges, OnDestroy {

  @Input('page')
  set page(page: number) {
    this._currentPage = page;
  }
  @Input('records-per-page')
  set recordsPerPage(records: number) {
    this._recordsPerPage = records;
  }
  get currentPage(): any {
    return this._currentPage;
  }
  set currentRecordsPerPage(recordsPerPage: number) {
    if (!this._recordsPerPage) {
      this._recordsPerPage = recordsPerPage;
    } else {
      this._recordsPerPage = recordsPerPage;
      this.firstPage();
    }
  }
  get currentRecordsPerPage(): number {
    return this._recordsPerPage;
  }
  form: FormGroup;

  @Input('size') size: 'sm';
  @Input('total-pages') totalPages: number;

  @ViewChild('inputCurrentPage')
  inputCurrentPage: ElementRef;
  public;

  maskPositiveInteger = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 10,
  });

  @Input('records-per-page-options') recordsPerPageOptions = [5, 10, 15, 25, 50];

  @Output() pagination = new EventEmitter();
  pageChange: number = 1;

  private _currentPage: number;

  private _recordsPerPage: number;

  constructor(private toastr: ToastrService) { }

  setCurrentPage() {
    this.inputCurrentPage.nativeElement.blur();
    const page = parseInt(this.inputCurrentPage.nativeElement.value);
    if (page !== this.currentPage) {
      this.changeCurrentPage(page);
    }
  }

  changeCurrentPage(currentPage) {
    this.inputCurrentPage.nativeElement.classList.remove('invalid');

    if (currentPage.toString().match(/^\d+$/)) {
      if (currentPage <= this.totalPages) {
        if (!this._currentPage) {
          this._currentPage = currentPage;
          this.pageChange = currentPage;
        } else {
          this._currentPage = currentPage;
          this.pageChange = currentPage;
          this.emitPagination();
        }
      } else {
        this.toastr.warning('A página solicitada não existe.');
        this.inputCurrentPage.nativeElement.classList.add('invalid');
      }
    }
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.page) {
      this.pageChange = changes.page.currentValue;
    }
  }

  ngOnDestroy() { }

  nextPage() {
    this.changeCurrentPage(this._currentPage + 1);
  }

  previousPage() {
    this.changeCurrentPage(this._currentPage - 1);
  }

  firstPage() {
    this.changeCurrentPage(1);
  }

  lastPage() {
    this.changeCurrentPage(this.totalPages);
  }

  private emitPagination() {
    this.pagination.emit({ page: this.currentPage, recordsPerPage: this.currentRecordsPerPage });
  }
}
