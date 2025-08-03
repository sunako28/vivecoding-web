const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY || 'YOUR_NOTION_API_KEY_HERE',
});

async function listPages() {
  try {
    console.log('Connecting to Notion...');
    
    // Search for all pages
    const response = await notion.search({
      query: '',
      filter: {
        property: 'object',
        value: 'page'
      }
    });
    
    console.log(`Found ${response.results.length} pages:`);
    
    response.results.forEach((page, index) => {
      console.log(`\n${index + 1}. Page ID: ${page.id}`);
      
      // Get page title
      if (page.properties && page.properties.title) {
        const title = page.properties.title.title
          .map(t => t.plain_text)
          .join('');
        console.log(`   Title: ${title}`);
      } else if (page.properties) {
        // Look for Name property (common in databases)
        const nameProperty = Object.values(page.properties).find(prop => 
          prop.type === 'title'
        );
        if (nameProperty && nameProperty.title) {
          const title = nameProperty.title
            .map(t => t.plain_text)
            .join('');
          console.log(`   Title: ${title}`);
        }
      }
      
      console.log(`   URL: ${page.url}`);
      console.log(`   Last edited: ${page.last_edited_time}`);
    });
    
    return response.results;
  } catch (error) {
    console.error('Error accessing Notion:', error.message);
    if (error.code === 'unauthorized') {
      console.error('Check your API key and permissions');
    }
  }
}

async function readPageContent(pageId) {
  try {
    console.log(`\nReading content of page: ${pageId}`);
    
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    console.log('\nPage content:');
    blocks.results.forEach((block, index) => {
      console.log(`\n${index + 1}. ${block.type.toUpperCase()}:`);
      
      switch (block.type) {
        case 'paragraph':
          const text = block.paragraph.rich_text
            .map(t => t.plain_text)
            .join('');
          console.log(`   ${text}`);
          break;
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
          const heading = block[block.type].rich_text
            .map(t => t.plain_text)
            .join('');
          console.log(`   ${heading}`);
          break;
        case 'bulleted_list_item':
        case 'numbered_list_item':
          const listText = block[block.type].rich_text
            .map(t => t.plain_text)
            .join('');
          console.log(`   • ${listText}`);
          break;
        default:
          console.log(`   [${block.type} block]`);
      }
    });
    
  } catch (error) {
    console.error('Error reading page content:', error.message);
  }
}

// Main execution
async function main() {
  const pages = await listPages();
  
  if (pages && pages.length > 0) {
    console.log('\n' + '='.repeat(50));
    console.log('Reading first page content as example:');
    console.log('='.repeat(50));
    await readPageContent(pages[0].id);
  }
}

main();