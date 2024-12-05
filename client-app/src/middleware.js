import { NextResponse } from 'next/server';

export function middleware (req) {
    const token = req.cookies.get("token");
    console.log(token);
    
    const {pathname} = req.nextUrl;

    if(!token && pathname.startsWith("/admin")){
        const response = NextResponse.redirect(new URL('/', req.url));
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return response;
    }
    return NextResponse.next();
}

export const config = {
    matcher : ["/admin/:path*"],
}
