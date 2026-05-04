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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const $ = cheerio.load(data);
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Product Name';
    let image = $('meta[property="og:image"]').attr('content') || $('link[rel="image_src"]').attr('href') || '';
    let priceText = '0';
    let currency = 'USD';

    // 1. Try JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        const product = json['@type'] === 'Product' ? json : (json['@graph']?.find((item: { '@type': string }) => item['@type'] === 'Product'));
        
        if (product) {
          title = product.name || title;
          image = (Array.isArray(product.image) ? product.image[0] : product.image) || image;
          
          const offers = product.offers;
          if (offers) {
            const offer = Array.isArray(offers) ? offers[0] : offers;
            priceText = offer.price || offer.lowPrice || priceText;
            currency = offer.priceCurrency || currency;
          }
        }
      } catch { }
    });

    // 2. Meta tags and common selectors if JSON-LD failed
    if (priceText === '0') {
      priceText = $('meta[property="product:price:amount"]').attr('content') || 
                  $('meta[name="twitter:data1"]').attr('content') || // Often used for price
                  $('.price').first().text() || 
                  $('.a-price-whole').first().text() ||
                  $('#priceblock_ourprice').text() ||
                  '.current-price'.split(' ').map(s => $(s).first().text()).find(t => t) ||
                  '0';
    }

    if (!image) {
      image = $('meta[name="twitter:image"]').attr('content') || '';
    }

    const price = parseFloat(priceText.toString().replace(/[^0-9.]/g, '')) || 0;
    currency = $('meta[property="product:price:currency"]').attr('content') || currency;

    return {
      title: title.trim(),
      image: image.startsWith('//') ? `https:${image}` : image,
      price,
      currency,
      url
    };
  } catch (error) {
    console.error('Fallback scraping error:', error);
    return null;
  }
}
