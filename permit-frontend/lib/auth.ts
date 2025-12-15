import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { syncUser } from './sync-user';

const clientId = process.env.AUTH_GITHUB_ID;
const clientSecret = process.env.AUTH_GITHUB_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be defined');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId,
      clientSecret
    })
  ],
  pages: {
    signIn: '/login' // página personalizada de login
  },
  callbacks: {
    async signIn({ user, account }) {
      // Sincronizar usuario con el backend después de autenticarse
      if (user?.email) {
        try {
          const result = await syncUser(user.email, user.name || undefined);
          if (!result.success) {
            // Log del error pero no bloquear el login
            console.warn('Error al sincronizar usuario con backend:', result.error);
          }
        } catch (error) {
          // No bloquear el login si falla la sincronización
          console.error('Error inesperado al sincronizar usuario:', error);
        }
      }
      return true;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/login';

      switch (true) {
        // Usuario logueado intentando acceder a /login
        case isLoggedIn && isLoginPage:
          return Response.redirect(new URL('/', nextUrl));

        // Página de login
        case isLoginPage:
          return true;

        // Todas las demás rutas
        default:
          return isLoggedIn;
      }
    }
  }
});
