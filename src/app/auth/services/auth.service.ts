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
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'authSession';
  private readonly session = signal<AuthSession | null>(this.restoreSession());
  private expirationTimer?: ReturnType<typeof setTimeout>;

  readonly user = computed(() => {
    const session = this.session();
    return session ? { id: session.id, email: session.email } : null;
  });
  readonly isAuthenticated = computed(() => this.session() !== null);

  constructor() {
    this.scheduleExpiration();
  }

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) => {
        // The API gives seconds; JavaScript timestamps use milliseconds.
        const expiresAt = new Date(response.created).getTime() + response.ttl * 1000;
        if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
          throw new Error('The server returned an expired or invalid session.');
        }
        const session: AuthSession = {
          token: response.id,
          id: response.userId,
          email: credentials.email,
          expiresAt,
        };
        this.session.set(session);
        this.scheduleExpiration();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(session));
          localStorage.removeItem('token');
        } catch {
          // Login still works for this page if browser storage is unavailable.
        }
      })
    );
  }

  getToken(): string | null {
    const session = this.session();
    // Recheck before requests in case the browser delayed the expiration timer.
    if (session && session.expiresAt <= Date.now()) {
      this.logout();
      return null;
    }
    return session?.token ?? null;
  }

  logout(): void {
    clearTimeout(this.expirationTimer);
    this.session.set(null);
    this.clearStoredSession();
  }

  private clearStoredSession(): void {
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
        typeof session.email === 'string' && session.email.length > 0 &&
        typeof session.expiresAt === 'number' &&
        Number.isFinite(session.expiresAt) && session.expiresAt > Date.now()
      ) {
        return {
          token: session.token,
          id: session.id,
          email: session.email,
          expiresAt: session.expiresAt,
        };
      }
    } catch {
      // Missing, malformed or inaccessible storage starts a logged-out session.
    }
    this.clearStoredSession();
    return null;
  }

  private scheduleExpiration(): void {
    clearTimeout(this.expirationTimer);
    const session = this.session();
    if (!session) return;

    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      this.logout();
      return;
    }
    // Browser timers cannot wait more than about 24.8 days in one call.
    this.expirationTimer = setTimeout(
      () => this.scheduleExpiration(),
      Math.min(remaining, 2_147_483_647)
    );
  }
}
