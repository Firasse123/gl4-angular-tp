import { Injectable, computed, inject, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';

interface AuthSession {
  token: string;
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'authSession';
  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly user = computed(() => {
    const session = this.session();
    return session ? { id: session.id, email: session.email } : null;
  });
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) => {
        const session: AuthSession = {
          token: response.id,
          id: response.userId,
          email: credentials.email,
        };
        this.session.set(session);
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(session));
          localStorage.removeItem('token');
        } catch {
          // Login still works for this page if browser storage is unavailable.
        }
      })
    );
  }

  logout(): void {
    this.session.set(null);
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem('token');
    } catch {
      // Always clear the in-memory session, even if storage is unavailable.
    }
  }

  private restoreSession(): AuthSession | null {
    try {
      const session = JSON.parse(localStorage.getItem(this.storageKey) ?? 'null');
      if (
        session &&
        typeof session.token === 'string' && session.token.length > 0 &&
        Number.isInteger(session.id) && session.id > 0 &&
        typeof session.email === 'string' && session.email.length > 0
      ) {
        return { token: session.token, id: session.id, email: session.email };
      }
    } catch {
      // Missing, malformed or inaccessible storage starts a logged-out session.
    }
    return null;
  }
}
