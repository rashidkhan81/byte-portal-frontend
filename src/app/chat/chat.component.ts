import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../api/chat.service';
import { ConversationService } from '../api/conversation.service';
import { ConversationResponse, MessageResponse } from '../api/api.models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  conversationId = 0;
  conversation: ConversationResponse | null = null;
  messages: MessageResponse[] = [];
  messageText = '';
  isLoading = true;
  isConnected = false;
  errorMessage = '';
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.conversationId) {
      this.errorMessage = 'This conversation could not be found.';
      this.isLoading = false;
      return;
    }

    this.subscriptions.add(this.chatService.messages().subscribe(message => {
      if (message.conversationId === this.conversationId) {
        this.messages = [...this.messages, message];
      }
    }));
    this.subscriptions.add(this.chatService.errors().subscribe(error => {
      this.isConnected = false;
      this.errorMessage = error;
    }));
    this.subscriptions.add(this.chatService.connectionState().subscribe(connected => this.isConnected = connected));

    this.conversationService.getById(this.conversationId).subscribe({
      next: response => this.conversation = response.data || null,
      error: error => this.errorMessage = error.error?.message || 'Conversation could not be loaded.',
      complete: () => this.loadMessages()
    });
  }

  sendMessage(): void {
    const content = this.messageText.trim();
    if (!content) {
      return;
    }
    this.chatService.send(this.conversationId, { content });
    this.messageText = '';
  }

  isOwnMessage(message: MessageResponse): boolean {
    const currentUserId = this.authService.getCurrentUser()?.id;
    return currentUserId !== undefined
      && message.senderId !== undefined
      && String(message.senderId) === String(currentUserId);
  }

  messageLabel(message: MessageResponse): string {
    return this.isOwnMessage(message) ? 'Sent' : 'Received';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.chatService.disconnect();
  }

  private loadMessages(): void {
    this.conversationService.getMessages(this.conversationId).subscribe({
      next: response => this.messages = response.data?.content || [],
      error: error => this.errorMessage = error.error?.message || 'Message history could not be loaded.',
      complete: () => {
        this.isLoading = false;
        this.chatService.connect(this.conversationId);
      }
    });
  }
}
