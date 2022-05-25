import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  selectedExercise: string;
  exerciseSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit(): void {
    //this.exercises = this.trainingService.getAvailableExercises();
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises);
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining() {
    if (this.selectedExercise) {
      this.trainingService.startExercise(this.selectedExercise);
    }
  }

  ngOnDestroy(): void {
    this.exerciseSub.unsubscribe();
  }
}
