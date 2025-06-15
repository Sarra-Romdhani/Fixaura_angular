import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Conversation, Message } from '../../classes/conversation.model';
import { ChatbotService } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface LocalMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot-discussion-page',
  templateUrl: './chatbot-discussion-page.component.html',
  styleUrls: ['./chatbot-discussion-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class ChatbotDiscussionPageComponent implements OnInit, OnDestroy {
  userId: string;
  messages: LocalMessage[] = [];
  conversations: Conversation[] = [];
  selectedConversationId: string | undefined;
  language = 'fr';
  isLoading = false;
  messageInput = '';
  private subscriptions: Subscription[] = [];

  languageFlags: { [key: string]: string } = {
    fr: 'bi bi-flag-fill flag-fr',
    en: 'bi bi-flag-fill flag-gb',
    ar: 'bi bi-flag-fill flag-sa',
    tn: 'bi bi-flag-fill flag-tn'
  };

  constructor(
    private route: ActivatedRoute,
    private chatbotService: ChatbotService,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'defaultUserId';
  }

  ngOnInit() {
    this.fetchConversations();
  }

  fetchConversations() {
    this.subscriptions.push(
      this.chatbotService.fetchConversations(this.userId).subscribe({
        next: (conversations: Conversation[]) => {
          console.log('Fetched conversations:', conversations);
          this.conversations = conversations || [];
          if (!conversations.length) {
            this.snackBar.open('No conversation history found.', 'Close', {
              duration: 3000,
              panelClass: ['info-snackbar']
            });
          }
        },
        error: (error: any) => {
          console.error('Fetch conversations error:', error);
          this.snackBar.open(`Error loading conversations: ${error.message || 'Unknown error'}`, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.conversations = [];
        }
      })
    );
  }

  sendMessage() {
    const message = this.messageInput.trim();
    if (!message) return;

    this.messages.push({ sender: 'user', text: message });
    this.isLoading = true;
    this.messageInput = '';

    this.subscriptions.push(
      this.chatbotService.sendMessage(this.userId, message, this.language, this.selectedConversationId).subscribe({
        next: (data: { response: string; conversationId?: string }) => {
          this.messages.push({ sender: 'bot', text: data.response });
          if (data.conversationId && !this.selectedConversationId) {
            this.selectedConversationId = data.conversationId;
          }
          this.fetchConversations();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.messages.push({ sender: 'bot', text: this.getErrorMessage() });
          this.isLoading = false;
          this.snackBar.open(`Error sending message: ${error.message || 'Unknown error'}`, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      })
    );
  }

  loadConversation(conversation: Conversation) {
    console.log('Loading conversation:', conversation);
    this.selectedConversationId = conversation.id;
    this.messages = (conversation.messages || []).map((msg: Message) => ({
      sender: msg.isUser ? 'user' : 'bot',
      text: msg.text || 'No content'
    }));
    this.language = conversation.lastLanguage || 'fr';
    if (!this.messages.length) {
      this.snackBar.open('No messages in this conversation.', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar']
      });
    }
    console.log('Messages loaded:', this.messages);
  }

  startNewDiscussion() {
    this.selectedConversationId = undefined;
    this.messages = [];
    this.language = 'fr';
  }

  formatLastMessage(conversation: Conversation): string {
    let lastMessage = conversation.lastMessage;
    if (!lastMessage && conversation.messages && conversation.messages.length > 0) {
      lastMessage = conversation.messages[conversation.messages.length - 1].text;
    }
    if (!lastMessage) {
      console.warn(`No last message found for conversation ID: ${conversation.id}`);
      return 'No message';
    }
    return lastMessage.length > 25 ? lastMessage.substring(0, 25) + '...' : lastMessage;
  }

  getErrorMessage(): string {
    switch (this.language) {
      case 'tn':
        return 'Problème de connexion! Essa3 marra okhra.';
      case 'ar':
        return 'مشكلة في الإتصال! حاول مرة أخرى.';
      case 'en':
        return 'Connection issue! Please try again.';
      default:
        return 'Problème de connexion ! Veuillez réessayer.';
    }
  }

  getAppTitle(): string {
    switch (this.language) {
      case 'tn':
        return 'Chatbot Tunisien';
      case 'ar':
        return 'روبوت الدردشة';
      case 'en':
        return 'Chat Bot';
      default:
        return 'Chatbot Multilingue';
    }
  }

  getHintText(): string {
    switch (this.language) {
      case 'tn':
        return 'Ektob messagek...';
      case 'ar':
        return 'اكتب رسالتك...';
      case 'en':
        return 'Type your message...';
      default:
        return 'Entrez votre message...';
    }
  }

  isRTL(text: string): boolean {
    const rtlRegex = /[\u0600-\u06FF]/;
    return rtlRegex.test(text);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}