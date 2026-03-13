import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookings: any[] = [];
  userName: string = '';
  isModalOpen = false;
  private apiUrl = 'https://localhost:7205/api/yoga/bookings';

  form = { title: '', date: '', time: '', category: 'Video Tutorial' };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getUserName() || '';
    this.refresh();
  }

  refresh() {
    this.http.get<any[]>(`${this.apiUrl}/${this.userName}`).subscribe(data => {
      this.bookings = data;
    });
  }

  save() {
    const payload = { ...this.form, username: this.userName };
    this.http.post(this.apiUrl, payload).subscribe(() => {
      this.closeModal();
      this.refresh();
    });
  }

  remove(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.refresh());
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }
}