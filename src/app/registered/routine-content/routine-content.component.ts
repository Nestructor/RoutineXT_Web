import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-routine-content',
  templateUrl: './routine-content.component.html',
  styleUrls: ['./routine-content.component.css']
})
export class RoutineContentComponent implements OnInit {

  hideButtonMessage: boolean = false;
  hideRowMessage: boolean = false;
  stopTimer: boolean = false;
  intervalTimer1: any
  intervalTimer2: any
  
  timeRelax: number
  time: number
  mm: string = "00"
  ss: string = "00"

  page: number = 1
  books: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  constructor() {

  }

  ngOnInit(): void {
    this.startTimer()
    this.startChrono()
  }

  hideButton() {
    this.hideButtonMessage = !this.hideButtonMessage ? true : false
  }
  
  hideRow() {
    this.hideRowMessage = !this.hideRowMessage ? true : false
  }

  startTimer() {
    this.timeRelax = 25
    this.intervalTimer1 = setInterval(() => {
      if(!this.stopTimer) {
        this.timeRelax = this.timeRelax > 0 ? this.timeRelax-1 : this.timeRelax = 0;
      }
    }, 1000)

    this.time = 85;
    this.intervalTimer2 = setInterval(() => {
      if(!this.stopTimer) {
        this.time = this.time > 0 ? this.time-1 : this.time = 0
      }
    }, 1000)
  }    

  endTimer() {
    clearInterval(this.intervalTimer1)
    clearInterval(this.intervalTimer2)
    this.startTimer()
  }
  
  startChrono() {
    let intervalTime, minutes = 0, seconds = 0
    intervalTime = setInterval(() => {
      if(!this.stopTimer) {
        if(seconds < 60) {
          seconds++;
          if(seconds == 60) {
            seconds = 0;
            minutes++
            this.mm = minutes < 10 ? "0" + String(minutes) : String(minutes)
          }
          this.ss = seconds < 10 ? "0" + String(seconds) : String(seconds)
        }
      }
    }, 1000)
  }    

  stopTimers() {
    this.stopTimer = !this.stopTimer ? true : false
  }

}
