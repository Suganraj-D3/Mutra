import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  owner: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly STORAGE_KEY = 'app_user_notes_vault';

  constructor(private authService: AuthService) {}

  getNotes(): Note[] {
    const user = this.authService.getUserName();
    const data = localStorage.getItem(this.STORAGE_KEY);
    const allNotes: Note[] = data ? JSON.parse(data) : [];
    return allNotes
      .filter(n => n.owner === user)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  saveNote(title: string, content: string): void {
    const user = this.authService.getUserName();
    const allNotes = this.getAllRawNotes();
    
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || 'Untitled Note',
      content,
      createdAt: new Date(),
      owner: user || 'v'
    };

    allNotes.push(newNote);
    this.updateStorage(allNotes);
  }

  deleteNote(id: string): void {
    const filtered = this.getAllRawNotes().filter(n => n.id !== id);
    this.updateStorage(filtered);
  }

  private getAllRawNotes(): Note[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private updateStorage(notes: Note[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
  }
}