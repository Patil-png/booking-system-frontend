#!/usr/bin/env node

/**
 * Comprehensive URL Submission Script for Gouri Inn
 * This script submits all important URLs to search engines for immediate indexing
 */

import https from 'https';
import http from 'http';

const websiteUrl = 'https://gouri-inn.vercel.app';

// All important URLs to submit
const importantUrls = [
  'https://gouri-inn.vercel.app/',
  'https://gouri-inn.vercel.app/rooms',
  'https://gouri-inn.vercel.app/gallery',
  'https://gouri-inn.vercel.app/contact',
  'https://gouri-inn.vercel.app/about',
  'https://gouri-inn.vercel.app/room-booking',
  'https://gouri-inn.vercel.app/seva',
  'https://gouri-inn.vercel.app/family-rooms',
  'https://gouri-inn.vercel.app/wedding-venue',
  'https://gouri-inn.vercel.app/banquet-hall',
  'https://gouri-inn.vercel.app/restaurant',
  'https://gouri-inn.vercel.app/business-hotel',
  'https://gouri-inn.vercel.app/budget-hotel',
  'https://gouri-inn.vercel.app/amenities',
  'https://gouri-inn.vercel.app/location'
];

const sitemapUrl = 'https://gouri-inn.vercel.app/sitemap.xml';

// Search engine submission URLs
const searchEngines = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    method: 'GET'
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    method: 'GET'
  }
];

// Function to make HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, { method }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to submit URLs to search engines
async function submitToSearchEngines() {
  console.log('🚀 Starting comprehensive URL submission for Gouri Inn...\n');

  // Submit sitemap to search engines
  console.log('📡 Submitting sitemap to search engines...');
  for (const engine of searchEngines) {
    try {
      console.log(`Submitting to ${engine.name}...`);
      const response = await makeRequest(engine.url, engine.method);
      
      if (response.statusCode === 200) {
        console.log(`✅ Successfully submitted to ${engine.name}`);
      } else {
        console.log(`⚠️  ${engine.name} returned status: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ Error submitting to ${engine.name}: ${error.message}`);
    }
  }

  console.log('\n📋 Manual submission steps for immediate indexing:');
  console.log('\n1. GOOGLE SEARCH CONSOLE:');
  console.log('   - Go to: https://search.google.com/search-console');
  console.log('   - Select your property: https://gouri-inn.vercel.app');
  console.log('   - Go to "URL Inspection"');
  console.log('   - Submit these URLs one by one:');
  
  importantUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });

  console.log('\n2. BING WEBMASTER TOOLS:');
  console.log('   - Go to: https://www.bing.com/webmasters');
  console.log('   - Add your site and submit sitemap');
  console.log('   - Submit individual URLs');

  console.log('\n3. DIRECT SITEMAP SUBMISSION:');
  console.log('   - Google: https://www.google.com/ping?sitemap=https://gouri-inn.vercel.app/sitemap.xml');
  console.log('   - Bing: https://www.bing.com/ping?sitemap=https://gouri-inn.vercel.app/sitemap.xml');

  console.log('\n4. LOCAL BUSINESS LISTINGS:');
  console.log('   - Google My Business: https://business.google.com/');
  console.log('   - TripAdvisor: https://www.tripadvisor.com/');
  console.log('   - Booking.com: https://www.booking.com/');
  console.log('   - MakeMyTrip: https://www.makemytrip.com/');
  console.log('   - Goibibo: https://www.goibibo.com/');

  console.log('\n5. SOCIAL MEDIA:');
  console.log('   - Share your website URL on all social media platforms');
  console.log('   - Create posts about your hotel services');

  console.log('\n🎯 Expected Timeline for Immediate Indexing:');
  console.log('- 24-48 hours: First pages should appear in search results');
  console.log('- 1 week: All pages should be indexed');
  console.log('- 2 weeks: Improved rankings for target keywords');
  console.log('- 1 month: Top rankings for "best hotel Amravati"');

  console.log('\n📊 Success Metrics:');
  console.log('- All 15 pages indexed by Google');
  console.log('- Appear in search results for "hotel Amravati"');
  console.log('- Rich snippets for reviews and ratings');
  console.log('- Local pack inclusion for Amravati searches');

  console.log('\n🔍 Monitor Progress:');
  console.log('- Check Google Search Console "Coverage" report');
  console.log('- Monitor "URL Inspection" for indexing status');
  console.log('- Track organic traffic in Google Analytics');
  console.log('- Monitor rankings for target keywords');
}

// Run the submission
submitToSearchEngines().catch(console.error); 