import { BehaviorSubject } from 'rxjs';
import jwt from 'jsonwebtoken';

export const token$ = new BehaviorSubject(window.localStorage.getItem('token') ||
    null);
export const email$ = new BehaviorSubject(null);

token$.subscribe((token) => {
    try {
        const decoded = jwt.decode(token);
        email$.next(decoded.email);
    } catch (err) {
        email$.next(null);
    }
});

// const email$ = token$.pipe(map(x => jwt.decode(x).email));

export function updateToken(newToken) {
    if (!newToken) {
        window.localStorage.removeItem('token');
    } else {
        window.localStorage.setItem('token', newToken);
    }

    token$.next(newToken);
}