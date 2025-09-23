import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-bold text-secondary-900 mt-4">Page not found</h2>
          <p className="text-secondary-600 mt-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              <HomeIcon className="h-5 w-5 mr-2" />
              Go back home
            </Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Browse products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
