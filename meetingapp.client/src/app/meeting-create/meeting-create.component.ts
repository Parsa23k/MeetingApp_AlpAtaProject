import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css']
})
export class MeetingCreateComponent {
  meetingForm: FormGroup;
  files: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.meetingForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
    });
  }

  onFileChange(event: any) {
    this.files = event.target.files;
  }

  onSubmit() {
    if (this.meetingForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.meetingForm.get('name')?.value);
    formData.append('startDate', this.meetingForm.get('startDate')?.value);
    formData.append('endDate', this.meetingForm.get('endDate')?.value);
    formData.append('description', this.meetingForm.get('description')?.value);

    for (let i = 0; i < this.files.length; i++) {
      formData.append('documents', this.files[i]);
    }

    this.http.post('/api/meetings/create', formData).subscribe(
      response => {
        console.log('Meeting created', response);
        // Redirect to meetings page after successful creation
        this.router.navigate(['/meetings']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
