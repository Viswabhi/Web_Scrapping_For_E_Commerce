import axios from 'axios';
import * as cheerio from 'cheerio';  
import * as XLSX from 'xlsx';

async function scrapeProducts() {
    try {
        const result = await axios.get('https://www.meesho.com/accessories-men/pl/3tp');
        const $ = cheerio.load(result.data);
        const scriptContent = $('#__NEXT_DATA__').html();
        const jsonData = JSON.parse(scriptContent);
        const products = jsonData.props.pageProps.initialState.productListing.listing.products[0].products;
        console.log('products:', products);
        const extractedData = products.map(product => ({
            name: product.name,
            price: product.min_product_price,
            availability: product.valid ? 'In Stock' : 'Out of Stock',
            rating: product.catalog_reviews_summary?.average_rating || 'No rating'
        }));

        const worksheet = XLSX.utils.json_to_sheet(extractedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
        console.log('Data successfully written to products.xlsx');
    } catch (error) {
        console.error('Error:', error);
    }
}

scrapeProducts();
