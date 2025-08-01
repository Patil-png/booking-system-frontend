#!/usr/bin/env node

/**
 * Search Engine Submission Script for Gouri Inn Website
 * This script helps submit your website to major search engines for better indexing
 */

import https from 'https';
import http from 'http';

const websiteUrl = 'https://gouri-inn.vercel.app';
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

// Function to submit to search engines
async function submitToSearchEngines() {
  console.log('🚀 Submitting Gouri Inn website to search engines...\n');

  for (const engine of searchEngines) {
    try {
      console.log(`📡 Submitting to ${engine.name}...`);
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

  console.log('\n📋 Manual submission steps:');
  console.log('1. Google Search Console: https://search.google.com/search-console');
  console.log('   - Add property: https://gouri-inn.vercel.app');
  console.log('   - Submit sitemap: https://gouri-inn.vercel.app/sitemap.xml');
  
  console.log('\n2. Bing Webmaster Tools: https://www.bing.com/webmasters');
  console.log('   - Add your site and submit sitemap');
  
  console.log('\n3. Local Business Listings:');
  console.log('   - Google My Business: https://business.google.com/');
  console.log('   - TripAdvisor: https://www.tripadvisor.com/');
  console.log('   - Booking.com: https://www.booking.com/');
  
  console.log('\n4. Social Media:');
  console.log('   - Create accounts and link to your website');
  console.log('   - Share your website URL regularly');
  
  console.log('\n🎯 Expected Timeline:');
  console.log('- Week 1-2: Initial indexing');
  console.log('- Month 1: First search appearances');
  console.log('- Month 2-3: Improved rankings');
  console.log('- Month 4-6: Top rankings for "gouri-inn"');
}

// Run the submission
submitToSearchEngines().catch(console.error); 