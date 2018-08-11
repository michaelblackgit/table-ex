import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  measurands: any[];
  selectedMeasurands: any[];
  rowDisplay: any[];
  measData: any[];
  currentTime: string;
  alive: boolean;
  selected: boolean;
  modalData: string;

  constructor(private modalService: NgbModal) {
    this.measurands = [];
    this.selectedMeasurands = [];
    this.rowDisplay = [];
    this.measData = [];
    this.currentTime = this.getTime();
  }

  ngOnInit() {
    this.selected = false;
  }

  ngOnDestroy() {
    this.alive = false;
    this.selected = false;
  }

  async update(): Promise<any> {
    while(this.alive) {
      await this.sleep(1000);
      this.currentTime = this.getTime();
      this.getMeasData();
      this.formatMeasData();
      if(this.measData.length > 7)
        this.rowDisplay = this.measData.slice(this.measData.length - 7);
      else this.formatIntroRowDisplay();
    }
  }

  getMeasData(): void {
    let vals = [];
    this.selectedMeasurands.forEach(() => vals.push(Math.floor(Math.random() * 10)));

    this.measData.push({
      time: this.currentTime,
      values: vals
    });
  }

  formatMeasData(): void {
    let i = 0;
    this.measData[this.measData.length - 1].values.forEach(val => {
      if(this.selectedMeasurands[i].value == val)
        this.measData[this.measData.length - 1].values[i] = ' ';
      else this.selectedMeasurands[i].value = val;
      i++;
    });
  }

  formatIntroRowDisplay(): void {
    this.rowDisplay = [];
    let vals = [];
    this.selectedMeasurands.forEach(() => vals.push(' '));
    for(let i = 0; i < (7 - this.measData.length); i++) {
      this.rowDisplay.push({ time: this.currentTime, values: vals });
    }
    this.measData.forEach((meas) => this.rowDisplay.push(meas));
  }

  sleep(ms: number): Promise<any> {
    return new Promise(r => setTimeout(r, ms));
  }

  getTime(): string {
    let d = new Date();
    let h = this.addZero(d.getHours());
    let m = this.addZero(d.getMinutes());
    let s = this.addZero(d.getSeconds());
    return h + ":" + m + ":" + s;
  }

  addZero(i: number): string {
    let j = i.toString();
    if(i < 10) j = "0" + j;
    return j;
  }

  start(): void {
    this.alive = true;
    this.update();
  }

  stop(): void {
    this.alive = false;
  }

  private open(): void {
    const modalRef = this.modalService.open(TableModal);
    modalRef.componentInstance.data = this.modalData;
    modalRef.result.then(result => {
      this.selectedMeasurands = result;
      this.alive = true;
      this.selected = true;
      this.formatIntroRowDisplay();
      this.update();
    });
  }
}

@Component({
  selector: 'table-modal',
  templateUrl: './table.modal.html',
  styles: []
})

export class TableModal {

  measurands: any[];
  selectedMeasurands: any[];

  constructor(public activeModal: NgbActiveModal) {
    this.measurands = [
      { name: 'meas1', value: '1' },
      { name: 'meas2', value: '2' },
      { name: 'meas3', value: '3' },
      { name: 'meas4', value: '4' },
      { name: 'meas5', value: '5' }
    ];
    this.selectedMeasurands = [];
  }

  private select(): void {
    this.activeModal.close(this.selectedMeasurands);
  }

  private addMeasurand(meas: any): void {
    if(!this.selectedMeasurands.includes(meas))
      this.selectedMeasurands.push(meas);
  }
}
