import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { MessageRequest, MessageResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private readonly incomingMessages = new Subject<MessageResponse>();
  private readonly connectionErrors = new Subject<string>();
  private readonly connectedState = new BehaviorSubject<boolean>(false);

  messages(): Observable<MessageResponse> {
    return this.incomingMessages.asObservable();
  }

  errors(): Observable<string> {
    return this.connectionErrors.asObservable();
  }

  connectionState(): Observable<boolean> {
    return this.connectedState.asObservable();
  }

  connect(conversationId: number): void {
    this.disconnect();
    const token = localStorage.getItem('byteportal_access_token');
    if (!token) {
      this.connectionErrors.next('Your session has expired. Please sign in again.');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        this.connectedState.next(true);
        this.subscription = this.client?.subscribe(
          `/topic/conversation.${conversationId}`,
          (message: IMessage) => this.receive(message)
        ) || null;
      },
      onStompError: frame => {
        this.connectedState.next(false);
        this.connectionErrors.next(frame.headers['message'] || 'The chat connection was rejected.');
      },
      onWebSocketError: () => {
        this.connectedState.next(false);
        this.connectionErrors.next('The chat server is unavailable.');
      }
    });

    this.client.activate();
  }

  send(conversationId: number, request: MessageRequest): void {
    if (!this.client?.connected) {
      this.connectionErrors.next('Chat is still connecting. Please try again in a moment.');
      return;
    }

    this.client.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify(request)
    });
  }

  disconnect(): void {
    this.connectedState.next(false);
    this.subscription?.unsubscribe();
    this.subscription = null;
    if (this.client) {
      void this.client.deactivate();
      this.client = null;
    }
  }

  private receive(message: IMessage): void {
    try {
      this.incomingMessages.next(JSON.parse(message.body) as MessageResponse);
    } catch {
      this.connectionErrors.next('The chat server returned an invalid message.');
    }
  }
}
