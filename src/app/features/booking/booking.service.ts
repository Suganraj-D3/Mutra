import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

export interface Booking {
  id: string;
  title: string;
  date: Date;
  time: string;
  category: 'Video Tutorial' | 'Live Stream' | 'Personal Plan';
  description?: string;
  owner: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly STORAGE_KEY = 'yoga_app_bookings';

  constructor(private authService: AuthService) {}

  getUserBookings(): Booking[] {
    const user = this.authService.getUserName();
    const data = localStorage.getItem(this.STORAGE_KEY);
    const all: Booking[] = data ? JSON.parse(data) : [];
    return all
      .filter(b => b.owner === user)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addBooking(booking: Partial<Booking>) {
    const all = this.getAllRaw();
    const newEntry = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      owner: this.authService.getUserName()
    } as Booking;
    all.push(newEntry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  deleteBooking(id: string) {
    const filtered = this.getAllRaw().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  private getAllRaw(): Booking[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}