import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";
import {NgForm} from "@angular/forms";
import {Observable,Subscription} from "rxjs"
import {map} from "rxjs/operators";
import {UIService} from "../../shared/ui.service";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  isLoading = false;
  exercises!: Exercise[];
  private exerciseSubscription!: Subscription;
  private loadingSubscription!: Subscription;

  constructor(private trainingService: TrainingService,private uiService:UIService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingService.fetchAvaiblableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
