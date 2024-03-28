import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlsPage } from './controls.page';

describe('ControlsPage', () => {
  let component: ControlsPage;
  let fixture: ComponentFixture<ControlsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
