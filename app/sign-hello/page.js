'use client';

import { Providers } from '../providers/Providers';
import { SignHello } from '../components/SignHello';
import Link from 'next/link';

export default function SignHelloPage() {
  return (
    <Providers>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Simple Signature Test</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Back to Home
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <SignHello />
          
          <div className="mt-8 text-sm text-gray-400">
            <p>This page demonstrates a simple wallet connection and message signing using wagmi hooks.</p>
            <p>If this works correctly, we can implement the same approach for our NFT encryption system.</p>
          </div>
        </div>
      </div>
    </Providers>
  );
}
