import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotDiscussionPageComponent } from './chatbot-discussion-page.component';

describe('ChatbotDiscussionPageComponent', () => {
  let component: ChatbotDiscussionPageComponent;
  let fixture: ComponentFixture<ChatbotDiscussionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotDiscussionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotDiscussionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
