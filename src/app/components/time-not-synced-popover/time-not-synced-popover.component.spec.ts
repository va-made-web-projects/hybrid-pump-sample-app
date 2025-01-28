import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeNotSyncedPopoverComponent } from './time-not-synced-popover.component';

describe('TimeNotSyncedPopoverComponent', () => {
  let component: TimeNotSyncedPopoverComponent;
  let fixture: ComponentFixture<TimeNotSyncedPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeNotSyncedPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeNotSyncedPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
