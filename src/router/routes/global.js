export const APP = {
  name: 'home',
  path: '/',
  component: () => import('@/views/Home'),
  meta: { isPublic: true }
}

export const LOGOUT = {
  path: 'logout',
  name: 'logout',
  component: () => import('@/views/Logout'),
  meta: { isPublic: true }
}

export const ErroreServiziAuth = {
  name: 'pageErrorAuth',
  path: '/userDenied',
  component: () => import('@/views/errore/PaginaErroreServizio'),
  props: (route) => ({
    ...route.params
  }),
  meta: { isPublic: true }
}

export const ERRORE_404 = {
  name: 'errore404',
  path: '*',
  component: () => import('@/views/errore/404NotFound'),
  meta: { isPublic: true }
}
