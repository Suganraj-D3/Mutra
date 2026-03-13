import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  title:string="Mutra";
  notes: any[] = [];
  userName: string = '';
  isEditorOpen: boolean = false;
  newNoteTitle: string = '';
  newNoteContent: string = '';
  private apiUrl = 'https://localhost:7205/api/yoga/notes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getUserName() || '';
    this.loadNotes();
  }

  loadNotes() {
    this.http.get<any[]>(`${this.apiUrl}/${this.userName}`).subscribe(data => {
      this.notes = data;
    });
  }

  saveNote() {
    if (!this.newNoteContent.trim()) return;

    const payload = {
      username: this.userName,
      title: this.newNoteTitle,
      content: this.newNoteContent
    };

    this.http.post(this.apiUrl, payload).subscribe(() => {
      this.isEditorOpen = false;
      this.newNoteTitle = '';
      this.newNoteContent = '';
      this.loadNotes();
    });
  }

  deleteNote(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadNotes();
    });
  }

  toggleEditor() { this.isEditorOpen = !this.isEditorOpen; }
}