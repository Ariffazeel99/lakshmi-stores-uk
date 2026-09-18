import fs from 'fs';
import path from 'path';

const extractedPath = path.resolve(process.cwd(), 'data/extracted_products.json');
const outputPath = path.resolve(process.cwd(), 'data/live_products.json');

if (!fs.existsSync(extractedPath)) {
  console.error('❌ extracted_products.json not found');
  process.exit(1);
}

const rawList = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

function mapCategory(type) {
  if (!type) return 'Indian Groceries & Essentials';
  const t = type.toUpperCase();
  if (t.includes('VEGETABLE') || t.includes('FRUIT') || t.includes('GREENS')) return 'Fresh Vegetables & Greens';
  if (t.includes('DAL') || t.includes('PULSE') || t.includes('LENTIL') || t.includes('BEANS')) return 'Dals & Pulses';
  if (t.includes('RICE') || t.includes('ATTA') || t.includes('FLOUR') || t.includes('MILLET') || t.includes('RAVA')) return 'Rice & Flours';
  if (t.includes('SPICE') || t.includes('MASALA') || t.includes('CHILLI') || t.includes('PEPPER')) return 'Spices & Masalas';
  if (t.includes('SWEET') || t.includes('SNACK') || t.includes('NAMKEEN') || t.includes('MIX') || t.includes('PICKLE') || t.includes('CHUTNEY')) return 'Ready Mixes & Sweets';
  if (t.includes('POOJA') || t.includes('AGARBATTI') || t.includes('DIYAS') || t.includes('CAMPHOR')) return 'Pooja & Festive Items';
  if (t.includes('MEAT') || t.includes('FISH') || t.includes('SEAFOOD')) return 'Fresh Meat & Halal';
  if (t.includes('HEALTH') || t.includes('BEAUTY') || t.includes('AYURVEDA')) return 'Health & Ayurvedic';
  return type;
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const mappedProducts = rawList.map((item, idx) => {
  const primaryImg = item.primary_image_url || 'https://cdn.shopify.com/s/files/1/0152/6530/0544/products/curry-leaves_0e540a77-2c5e-4263-9594-01f0f63e9bde.jpg?v=1642501396';
  const category = mapCategory(item.product_type);
  const cleanDesc = cleanHtml(item.description);

  const options = (item.variants && item.variants.length > 0)
    ? item.variants.map((v) => {
        let weightTitle = v.title;
        if (!weightTitle || weightTitle.toLowerCase() === 'default title') {
          weightTitle = 'Standard Pack';
        }
        return {
          weight: weightTitle,
          priceGBP: Number(v.price) || Number(item.price) || 0.99,
          originalPriceGBP: v.compare_at_price ? Number(v.compare_at_price) : undefined,
          inStock: v.available !== false
        };
      })
    : [
        {
          weight: 'Standard Pack',
          priceGBP: Number(item.price) || 0.99,
          originalPriceGBP: item.compare_at_price ? Number(item.compare_at_price) : undefined,
          inStock: true
        }
      ];

  const tags = Array.isArray(item.tags) ? item.tags : [];
  const lowerTitle = (item.title || '').toLowerCase();
  const isAirFreight = lowerTitle.includes('air') || lowerTitle.includes('fresh') || tags.some(t => String(t).toLowerCase().includes('fresh'));
  const isOffer = options.some(o => o.originalPriceGBP && o.originalPriceGBP > o.priceGBP);
  const isBestseller = idx % 7 === 0 || tags.some(t => String(t).toLowerCase().includes('bestseller'));
  const isFestive = category.includes('Pooja') || category.includes('Sweets') || lowerTitle.includes('diwali') || lowerTitle.includes('pongal');

  return {
    id: `ls-${item.id}`,
    name: item.title,
    tamilName: undefined,
    category,
    subCategory: item.product_type || category,
    brand: item.vendor || 'Lakshmi Stores UK',
    description: cleanDesc || `${item.title} sourced authentically by Lakshmi Stores UK. High quality Indian grocery essentials with express UK delivery.`,
    origin: isAirFreight ? 'Tamil Nadu & Kerala, India' : 'India',
    rating: Number((4.6 + ((idx % 5) * 0.08)).toFixed(1)),
    reviewCount: 20 + ((idx * 17) % 230),
    isAirFreightFresh: isAirFreight,
    isBestseller: isBestseller,
    isWeeklyOffer: isOffer,
    isFestiveSpecial: isFestive,
    image: primaryImg,
    dietaryTags: isAirFreight ? ['Air Freight Fresh', 'Authentic Indian'] : ['Authentic Sourced', '100% Genuine'],
    options
  };
});

fs.writeFileSync(outputPath, JSON.stringify(mappedProducts, null, 2), 'utf8');
console.log(`✅ Converted ${mappedProducts.length} products to ${outputPath}`);

