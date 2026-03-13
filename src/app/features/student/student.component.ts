import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LessonsService } from 'src/app/core/Lesson/Lessons.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  greetingMessage: string = 'Loading...';
  user: any;
  studentProfile: any;
  isModalOpen: boolean = false;
  selectedTopic: string = "";
  indexing: number = 0;
  greeting: string = '';
  status: string = '';
  subjects: string[] = [];
  visitedLesson: any;

  learningProgress = {
    completedLessons: 0,
    totalLessons: 0,
    currentLevel: '',
    streak: 5
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private lessonService: LessonsService
  ) {}

  get progressPercentage(): number {
    if (this.learningProgress.totalLessons === 0) return 0;
    return (this.learningProgress.completedLessons / this.learningProgress.totalLessons) * 100;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.user = this.auth.getUserDetails();
      this.studentProfile = this.user;
      
      const currentUser = this.auth.getUserName();

      this.updateGreeting();

      this.lessonService.ensureUserSynced().pipe(
        switchMap((syncData) => {
          this.loadLessons();
          this.loadProgress();
          return of(syncData);
        })
      ).subscribe({
        error: (err) => this.lessonService.ErrorCaller(err)
      });
    } else {
      this.greetingMessage = "User not logged in";
    }
  }

  loadLessons() {
    this.lessonService.GetLessonsList().subscribe({
      next: (data) => {
        this.subjects = data;
        this.learningProgress.totalLessons = this.subjects.length;
        this.updateStatus();
      },
      error: (err) => this.lessonService.ErrorCaller(err)
    });
  }

  loadProgress() {
    this.lessonService.GetProgressCount().subscribe({
      next: (data) => {
        this.visitedLesson = data;
        this.learningProgress.completedLessons = data.learningCount;
        this.updateStatus();
      },
      error: (err) => this.lessonService.ErrorCaller(err)
    });
  }

  GetLessons() {
    alert("The output will be displayed in the console... to watch press (F12)");
    this.lessonService.GetLessonsList().subscribe({
      next: (data) => { console.log(data); },
      error: (err) => { this.lessonService.ErrorCaller(err); }
    });
  }

  updateGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  updateStatus() {
    const value = this.learningProgress.completedLessons;
    const tot = this.learningProgress.totalLessons;
    if (tot === 0) return;

    if (value <= tot / 4) this.status = "Low";
    else if (value <= tot / 2) this.status = "Average";
    else if (value <= (tot * 0.75)) this.status = "Good";
    else this.status = "Excellent";
    
    this.learningProgress.currentLevel = this.status;
  }

  reset() {
    if (confirm("Are you sure? This will delete all your progress.")) {
      this.lessonService.DeleteAllProgressCount().subscribe({
        next: (response) => {
          console.log(response.message);
          this.loadProgress();
        },
        error: (err) => this.lessonService.ErrorCaller(err)
      });
    }
  }

  openTopic(topic: string) {
    this.indexing = this.subjects.indexOf(topic);
    this.selectedTopic = topic;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadProgress();
    this.updateStatus();
  }
}