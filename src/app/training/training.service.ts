import {Exercise} from "./exercise.model";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Subscription} from "rxjs";
import {UIService} from "../shared/ui.service";
import * as UI from "../shared/ui.action";
import * as fromTraining from "./training.reducer";
import * as Training from "./training.actions";
import {Store} from "@ngrx/store";
import {take} from "rxjs/operators"

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService:UIService,
    private store: Store<fromTraining.State>
  ){}

  fetchAvaiblableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw (new Error());
          return docArray.map(doc => {
            const data = doc.payload.doc.data() as Exercise;
            return {
              id: doc.payload.doc.id,
              name: data.name,
              duration: data.duration,
              calories: data.calories
            };
          });
          }))
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    },error =>{
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later',null,3000);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      if (ex) {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      }
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      if (ex && ex.duration && ex.calories) {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      }
    });
  }


  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
