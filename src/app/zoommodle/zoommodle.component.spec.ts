import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoommodleComponent } from './zoommodle.component';

describe('ZoommodleComponent', () => {
  let component: ZoommodleComponent;
  let fixture: ComponentFixture<ZoommodleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoommodleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoommodleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
