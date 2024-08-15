import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Note the change from `styleUrl` to `styleUrls`
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Add any initialization logic here if necessary
  }

  title = 'meetingapp.client';
}
