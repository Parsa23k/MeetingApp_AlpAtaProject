import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to meetings if token exists
      this.router.navigate(['/meetings']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  onSubmit() {
    const loginData = this.loginForm.value;

    this.http.post('/api/users/login', loginData).subscribe(
      (response: any) => {  // Expecting token in response
        const token = response.token;  // Extract token from backend response
        if (token) {
          // Store the authentication token in localStorage
          localStorage.setItem('token', token);
          // Redirect to the meetings page
          this.router.navigate(['/meetings']);
        }
      },
      error => {
        console.error(error);
      }
    );
  }
}
