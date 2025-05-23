// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
// import { JWT_SECRET } from './config';

// const encoder = new TextEncoder();

// const verifyToken = async (token: string) => {
//   try {
//     const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
//     return payload;
//   } catch {
//     return null;
//   }
// };

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   if (path === '/api/v2/signup' || path === '/api/v2/signin') {
//     return NextResponse.next();
//   }

//   const authHeader = req.headers.get('authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return NextResponse.json({ msg: 'The data is malformed' }, { status: 403 });
//   }

//   const token = authHeader.split(' ')[1];
//   const decoded = await verifyToken(token);

//   if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
//     return NextResponse.json({ msg: 'Invalid token' }, { status: 403 });
//   }

//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-user-id', String(decoded.userId));

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// export const config = {
//   matcher: '/api/v1/:path*', 
// };


import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from './config';

const encoder = new TextEncoder();

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload;
  } catch {
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip public auth routes
  if (path.startsWith('/api/v2/signup') || path.startsWith('/api/v2/signin')) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ msg: 'The data is malformed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = await verifyToken(token);

  if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
    return new NextResponse(JSON.stringify({ msg: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', String(decoded.userId));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/v2/:path*',
};
