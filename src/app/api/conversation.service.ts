import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ConversationResponse, MessageRequest, MessageResponse, PagedResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly url = `${environment.apiUrl}/api/conversations`;

  constructor(private readonly http: HttpClient) {}

  getMyConversations(page = 0, size = 10): Observable<ApiResponse<PagedResponse<ConversationResponse>>> {
    return this.http.get<ApiResponse<PagedResponse<ConversationResponse>>>(`${this.url}/my`, {
      params: { page, size }
    });
  }

  getById(conversationId: number): Observable<ApiResponse<ConversationResponse>> {
    return this.http.get<ApiResponse<ConversationResponse>>(`${this.url}/${conversationId}`);
  }

  getMessages(conversationId: number, page = 0, size = 20): Observable<ApiResponse<PagedResponse<MessageResponse>>> {
    return this.http.get<ApiResponse<PagedResponse<MessageResponse>>>(`${this.url}/${conversationId}/messages`, {
      params: { page, size }
    });
  }

  sendMessage(conversationId: number, request: MessageRequest): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(`${this.url}/${conversationId}/messages`, request);
  }
}
