import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PumpPage } from './pump.page';

describe('PumpPage', () => {
  let component: PumpPage;
  let fixture: ComponentFixture<PumpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PumpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
