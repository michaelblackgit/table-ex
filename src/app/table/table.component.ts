import { Component, OnInit, OnDestroy } from '@angular/core';

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

  constructor() {
    this.measurands = [];
    this.selectedMeasurands = [];
    this.rowDisplay = [];
    this.measData = [];
    this.currentTime = this.getTime();
  }

  ngOnInit() {
    this.selectedMeasurands = [
      { name: 'meas1', value: '1' },
      { name: 'meas2', value: '2' },
      { name: 'meas3', value: '3' }
    ];
    this.alive = true;
    this.update();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  async update(): Promise<any> {
    while(this.alive) {
      await this.sleep(1000);
      this.currentTime = this.getTime();
      this.getMeasData();
      this.formatMeasData();
      if(this.measData.length > 7)
        this.rowDisplay = this.measData.slice(this.measData.length - 7);
      else this.rowDisplay = this.measData;
    }
  }

  getMeasData(): void {
    let val1 = Math.floor(Math.random() * 10);
    let val2 = Math.floor(Math.random() * 10);
    let val3 = Math.floor(Math.random() * 10);

    this.measData.push({
      time: this.currentTime,
      values: [val1.toString(), val2.toString(), val3.toString()]
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
}
