import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
  title: string;
  image: string;
  price: number;
  currency: string;
  url: string;
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct | null> {
  if (!url) return null;

  try {
    if (url.includes('amazon.')) {
      return await scrapeAmazon(url);
    } else {
      return await scrapeFallback(url);
    }
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}

async function scrapeAmazon(url: string): Promise<ScrapedProduct | null> {
  const apiKey = process.env.RAINFOREST_API_KEY;
  if (!apiKey) {
    console.warn('RAINFOREST_API_KEY not found, falling back to basic scraper');
    return scrapeFallback(url);
  }

  const params = {
    api_key: apiKey,
    type: 'product',
    url: url
  };

  try {
    const response = await axios.get('https://api.rainforestapi.com/request', { params });
    const product = response.data.product;

    if (!product) return null;

    return {
      title: product.title,
      image: product.main_image?.link || '',
      price: product.buybox_winner?.price?.value || product.price?.value || 0,
      currency: product.buybox_winner?.price?.currency || 'USD',
      url: url
    };
  } catch (error) {
    console.error('Rainforest API error:', error);
    return scrapeFallback(url);
  }
}

async function scrapeFallback(url: string): Promise<ScrapedProduct | null> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Product Name';
    const image = $('meta[property="og:image"]').attr('content') || '';
    
    // Simple price extraction (look for common price classes or meta tags)
    const priceText = $('meta[property="product:price:amount"]').attr('content') || 
                    $('.price').first().text() || 
                    $('.a-price-whole').first().text() ||
                    '0';
    
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const currency = $('meta[property="product:price:currency"]').attr('content') || 'USD';

    return {
      title: title.trim(),
      image,
      price,
      currency,
      url
    };
  } catch (error) {
    console.error('Fallback scraping error:', error);
    return null;
  }
}
