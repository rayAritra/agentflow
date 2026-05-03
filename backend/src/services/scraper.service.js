import * as cheerio from 'cheerio';
import axios from 'axios';

export const scrapeURL = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(data);
    
    // Remove script, style, noscript, etc.
    $('script, style, noscript, iframe, img, svg').remove();
    
    // Extract text and clean up whitespace
    let text = $('body').text();
    text = text.replace(/\s+/g, ' ').trim();
    
    return text.substring(0, 15000); // Limit to ~15k chars per URL to avoid huge context
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return `[Failed to scrape ${url}: ${error.message}]`;
  }
};

export const scrapeMultiple = async (urls) => {
  const results = [];
  for (const url of urls) {
    const text = await scrapeURL(url);
    results.push(`--- Content from ${url} ---\n${text}\n`);
  }
  return results.join('\n');
};
