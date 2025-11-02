'use client';

import { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';

export default function AccountsPage() {
  const [accounts] = useState([
    { platform: 'Facebook', connected: false, username: '' },
    { platform: 'Instagram', connected: false, username: '' },
    { platform: 'Twitter', connected: false, username: '' },
    { platform: 'LinkedIn', connected: false, username: '' },
    { platform: 'YouTube', connected: false, username: '' },
    { platform: 'Pinterest', connected: false, username: '' },
    { platform: 'Threads', connected: false, username: '' },
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-8 w-8" />;
      case 'instagram':
        return <Instagram className="h-8 w-8" />;
      case 'twitter':
        return <Twitter className="h-8 w-8" />;
      case 'youtube':
        return <Youtube className="h-8 w-8" />;
      default:
        return <LinkIcon className="h-8 w-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Accounts</h1>
        <p className="text-gray-600">
          Connect your social media accounts to enable posting
        </p>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> To connect social media accounts, you need to obtain API keys and access tokens from each platform. Add them to your .env file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.platform} className="card">
            <div className="flex items-center mb-4">
              <div className="text-primary-600">{getPlatformIcon(account.platform)}</div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                {account.platform}
              </h3>
            </div>

            {account.connected ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Connected as <span className="font-medium">{account.username}</span>
                </p>
                <button className="btn btn-danger w-full text-sm">
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">Not connected</p>
                <button className="btn btn-primary w-full text-sm">
                  Connect Account
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How to Connect Accounts
        </h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">1. Facebook & Instagram</h4>
            <p>
              Create a Facebook App at{' '}
              <a
                href="https://developers.facebook.com"
                target="_blank"
                className="text-primary-600 hover:underline"
              >
                developers.facebook.com
              </a>
              . Get your access token and add it to the .env file.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">2. Twitter/X</h4>
            <p>
              Apply for Twitter API access at{' '}
              <a
                href="https://developer.twitter.com"
                target="_blank"
                className="text-primary-600 hover:underline"
              >
                developer.twitter.com
              </a>
              . Add your API keys to the .env file.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">3. YouTube</h4>
            <p>
              Enable YouTube Data API v3 in Google Cloud Console and get your API key.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">4. Pinterest</h4>
            <p>
              Create a Pinterest App and get your access token from the Pinterest Developer Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
