import {Subject} from "rxjs";
import {Exercise} from "./exercise.model";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Subscription} from "rxjs";
import {UIService} from "../shared/ui.service";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8},
  ];

  private runningExercise?: Exercise | null;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,private uiService:UIService){}

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
        console.log(exercises);
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    },error =>{
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later',null,3000);
        this.exercisesChanged.next([]);
      }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' +selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );

    this.exerciseChanged.next({
      ...this.runningExercise!
    });
  }

  completeExercise() {
    this.addDataToDatabase(
      {...this.runningExercise!,}
    );
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise!,
      duration: this.runningExercise!.duration * (progress / 100),
      calories: this.runningExercise!.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: unknown[]) => {
        const exercisesCast = exercises as Exercise[];
        this.finishedExercisesChanged.next(exercisesCast);
    }));
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
