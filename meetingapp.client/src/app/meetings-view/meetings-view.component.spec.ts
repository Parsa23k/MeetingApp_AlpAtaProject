import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsViewComponent } from './meetings-view.component';

describe('MeetingsViewComponent', () => {
  let component: MeetingsViewComponent;
  let fixture: ComponentFixture<MeetingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
