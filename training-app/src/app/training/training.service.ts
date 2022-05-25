import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, map, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private fbSubs: Subscription[] = [];

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  constructor(private fireStore: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(this.fireStore
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            const data = doc.payload.doc.data() as Exercise;
            return {
              id: doc.payload.doc.id,
              name: data.name,
              duration: data.duration,
              calories: data.calories,
            };
          });
        })
      )
      .subscribe(
        (exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        }
      ));
  }

  fetchFinishedExercises() {
    this.fbSubs.push(this.fireStore
      .collection('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises) => {
          this.finishedExercisesChanged.next(exercises as Exercise[]);
        }
      ));
  }

  cancelSubs() {
    this.fbSubs.forEach(sub => sub.unsubscribe);
  }

  startExercise(selectedId: string) {
    this.fireStore
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() });
    const selectedExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (selectedExercise) {
      this.runningExercise = selectedExercise;
    }
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.exerciseChanged.next(null);
  }

  getExercises() {
    return this.exercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    this.fireStore.collection('finishedExercises').add(exercise);
  }
}
