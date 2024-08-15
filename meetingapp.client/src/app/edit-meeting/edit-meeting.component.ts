import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent implements OnInit {
  editForm!: FormGroup;
  meetingId!: number;
  selectedFiles: File[] = [];
  existingDocuments: string[] = [];
  documentsToDelete: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.meetingId = +this.route.snapshot.paramMap.get('id')!;

    // Initialize the form
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      deleteAllDocuments: [false],  // Add this control to the form group
    });

    // Load the meeting details
    this.http.get(`/api/meetings/${this.meetingId}`).subscribe(
      (meeting: any) => {
        this.editForm.patchValue({
          name: meeting.name,
          startDate: meeting.startDate.split('T')[0], // Adjusting for date input
          endDate: meeting.endDate.split('T')[0],     // Adjusting for date input
          description: meeting.description
        });
        this.existingDocuments = meeting.documentUrls || [];
      },
      error => {
        console.error('Error loading meeting', error);
      }
    );
  }

  // Handle file selection for new documents
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  // Mark document for deletion
  markForDeletion(url: string): void {
    // Add the document URL to the list of documents to delete
    if (!this.documentsToDelete.includes(url)) {
      this.documentsToDelete.push(url);
    }

    // Remove the document from the existingDocuments list in the UI
    this.existingDocuments = this.existingDocuments.filter(doc => doc !== url);
  }

  // Handle form submission
  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.editForm.get('name')!.value);
    formData.append('startDate', this.editForm.get('startDate')!.value);
    formData.append('endDate', this.editForm.get('endDate')!.value);
    formData.append('description', this.editForm.get('description')!.value);
    formData.append('deleteAllDocuments', String(this.editForm.get('deleteAllDocuments')!.value));

    // Append selected files
    this.selectedFiles.forEach(file => {
      formData.append('documents', file);
    });

    // Append documents to delete
    if (!this.editForm.get('deleteAllDocuments')!.value && this.documentsToDelete.length > 0) {
      this.documentsToDelete.forEach(url => formData.append('documentsToDelete', url));
    }

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.http.post(`/api/meetings/${this.meetingId}`, formData).subscribe(
      () => {
        this.router.navigate(['/meetings']); // Redirect to meetings page after saving
      },
      error => {
        console.error('Error saving changes', error);
      }
    );
  }

  getFileName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }
}
