/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Format a date string to short date only
 */
export function formatShortDate(dateString) {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Truncate a string to a given length
 */
export function truncate(str, maxLen = 60) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

/**
 * Generate a placeholder product image based on category
 */
export function getProductImage(product) {
  if (product?.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl;
  }
  // Use loremflickr to get an image based on the product name
  const seed = product?.id ?? 1;
  let keyword = 'product';
  if (product?.name) {
    keyword = encodeURIComponent(product.name.split(' ')[0].toLowerCase());
  }
  return `https://loremflickr.com/400/300/${keyword}?lock=${seed}`;
}
