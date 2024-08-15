import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']  // Ensure this points to the correct CSS file
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedFile!: File;  // For storing the selected file

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Handle form submission
  onSubmit() {
    const formData = new FormData();
    formData.append('firstName', this.registerForm.get('firstName')!.value);
    formData.append('lastName', this.registerForm.get('lastName')!.value);
    formData.append('email', this.registerForm.get('email')!.value);
    formData.append('phoneNumber', this.registerForm.get('phoneNumber')!.value);
    formData.append('password', this.registerForm.get('password')!.value);

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);  // Append the profile picture file
    }

    this.http.post('/api/users/register', formData).subscribe(
      response => {
        // Store the authentication token or a flag in localStorage
        localStorage.setItem('token', 'some-auth-token');  // Use a real token
        // Redirect to the meetings page or another dashboard
        this.router.navigate(['/meetings']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
