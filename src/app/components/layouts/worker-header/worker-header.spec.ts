import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerHeader } from './worker-header';

describe('WorkerHeader', () => {
  let component: WorkerHeader;
  let fixture: ComponentFixture<WorkerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
