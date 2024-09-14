import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {TrainingService} from "./training.service";
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy{
  ongoingTraining = false;
  exerciseSubscription: Subscription| undefined;

  constructor(private trainingService: TrainingService) { }
ngOnInit() {
  this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
    (exercise : any) => {
        if (exercise) {
          this.ongoingTraining = true;
        }else{
          this.ongoingTraining = false;
        }
      }
    );
}

ngOnDestroy() {
    if (this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
}
}
