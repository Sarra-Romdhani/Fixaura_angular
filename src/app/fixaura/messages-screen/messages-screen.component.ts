import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../services/message.service';
import { Conversation } from '../../classes/message.model';
import { environment } from '../../environments/environment';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-messages-screen',
  templateUrl: './messages-screen.component.html',
  styleUrls: ['./messages-screen.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class MessagesScreenComponent implements OnInit, OnDestroy {
  userId: string = '';
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  errorMessage: string = '';
  searchQuery: string = '';
  currentIndex: number = 1; // Messages page index
  unreadMessagesCount: number = 0;
  loggedId: string = ''; // Add loggedId property
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loggedId = this.route.snapshot.queryParamMap.get('loggedId') || this.userId; // Retrieve loggedId
    console.log('MessagesScreenComponent: userId:', this.userId, 'loggedId:', this.loggedId);
    if (!this.userId || !this.loggedId) {
      console.error('No userId or loggedId provided, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    this.fetchConversations();
  }

  private fetchConversations(): void {
    this.messageService.getConversations(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conversations) => {
          console.log('Fetched conversations:', conversations);
          this.conversations = conversations.map(conv => ({
            ...conv,
            image: conv.image ? `${environment.baseUrl}${conv.image}` : ''
          }));
          this.conversations.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateB.getTime() - dateA.getTime();
          });
          this.filteredConversations = [...this.conversations];
          this.unreadMessagesCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error fetching conversations:', error);
          this.errorMessage = 'Failed to load conversations. Please try again later.';
          this.conversations = [];
          this.filteredConversations = [];
          this.unreadMessagesCount = 0;
        }
      });
  }

  filterConversations(): void {
    if (!this.searchQuery.trim()) {
      this.filteredConversations = [...this.conversations];
      return;
    }
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredConversations = this.conversations.filter(conversation =>
      conversation.name.toLowerCase().includes(query)
    );
    this.filteredConversations.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }

  navigateToDiscussion(receiverId: string): void {
    console.log('Navigating with userId:', this.userId, 'receiverId:', receiverId);
    if (!this.userId || !receiverId) {
      console.error('Invalid navigation parameters');
      this.errorMessage = 'Cannot navigate: Invalid user or receiver ID';
      return;
    }
    const conversation = this.conversations.find(c => c.id === receiverId);
    this.router.navigate([`/messages/discussion/${this.userId}/${receiverId}`], {
      queryParams: {
        userName: conversation?.name || 'User',
        userImage: conversation?.image || ''
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}