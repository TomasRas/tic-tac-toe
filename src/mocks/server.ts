import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/ws', () => {
    return HttpResponse.json({ message: 'ws connected' });
  })
);

export { server };