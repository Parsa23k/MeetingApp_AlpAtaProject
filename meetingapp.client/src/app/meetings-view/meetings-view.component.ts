import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-meetings-view',
  templateUrl: './meetings-view.component.html',
  styleUrls: ['./meetings-view.component.css']
})
export class MeetingsViewComponent implements OnInit {
  meetings: any[] = [];
  baseUrl: string = 'http://localhost:5226'; // Base URL for your API

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadMeetings();
  }

  // Load meetings from API
  loadMeetings(): void {
    this.http.get('/api/meetings').subscribe(
      (data: any) => {
        this.meetings = data;
        this.meetings.forEach(meeting => {
          meeting.documentUrls = meeting.documentUrls.map((url: string) => `${this.baseUrl}${url}`);
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  // Delete meeting by id
  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.http.delete(`/api/meetings/${id}`).subscribe(
        () => {
          this.meetings = this.meetings.filter(meeting => meeting.id !== id); // Update the UI
        },
        error => {
          console.error('Failed to delete meeting', error);
        }
      );
    }
  }

  // Navigate to edit meeting page
  editMeeting(id: number): void {
    this.router.navigate(['/edit-meeting', id]);
  }

  getFileName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }
}
