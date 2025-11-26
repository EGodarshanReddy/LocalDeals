import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect to the Swagger UI route so the app lands on docs by default
  redirect('/swagger');
}
