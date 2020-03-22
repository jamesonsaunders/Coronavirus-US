import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsMapComponent } from './us-map.component';

describe('UsMapComponent', () => {
  let component: UsMapComponent;
  let fixture: ComponentFixture<UsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
