import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  selectedExercise: string;
  exerciseSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private fireStore: AngularFirestore,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  onStartTraining() {
    if (this.selectedExercise) {
      this.trainingService.startExercise(this.selectedExercise);
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
