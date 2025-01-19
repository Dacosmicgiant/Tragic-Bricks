import { getTokenFromHeader, verifyToken } from '../lib/jwt';
import { NextResponse } from 'next/server';

export async function authMiddleware(request) {
  const token = getTokenFromHeader(request);
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  request.user = decoded;
  return NextResponse.next();
}
