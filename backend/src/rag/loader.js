import fs from 'fs/promises';
import { Document } from '@langchain/core/documents';

/**
 * Loads the XYZ knowledge base JSON file and parses it into LangChain Documents.
 * @param {string} filePath - Path to the xyz_knowledge_base.json file
 * @returns {Promise<Document[]>} Array of LangChain Documents
 */
export async function loadKnowledgeBase(filePath) {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(rawData);
    const documents = [];

    // 1. Company Info
    if (data.company) {
        const text = `Company Name: ${data.company.name}\nIndustry: ${data.company.industry}\nSupport Email: ${data.company.support_email}\nSupport Phone: ${data.company.support_phone}`;
        documents.push(new Document({
            pageContent: text,
            metadata: { type: 'company_info', source: filePath }
        }));
    }

    // 2. Products
    if (Array.isArray(data.products)) {
        for (const product of data.products) {
            const text = `Product Name: ${product.name}\nCategory: ${product.category}\nPrice: $${product.price}\nWarranty: ${product.warranty_years} years\nDescription: ${product.description}`;
            documents.push(new Document({
                pageContent: text,
                metadata: { type: 'product', id: product.product_id, category: product.category, source: filePath }
            }));
        }
    }

    // 3. FAQs
    if (Array.isArray(data.faqs)) {
        for (const faq of data.faqs) {
            const text = `FAQ - Question: ${faq.question}\nAnswer: ${faq.answer}`;
            documents.push(new Document({
                pageContent: text,
                metadata: { type: 'faq', id: faq.faq_id, source: filePath }
            }));
        }
    }

    // 4. Policies
    if (Array.isArray(data.policies)) {
        for (const policy of data.policies) {
            // Assuming policy has 'policy_id', 'title', 'content' or similar
            const title = policy.title || policy.policy_name || 'Policy';
            const content = policy.content || policy.description || policy.policy_content || JSON.stringify(policy);
            const text = `Policy: ${title}\nDetails: ${content}`;
            documents.push(new Document({
                pageContent: text,
                metadata: { type: 'policy', id: policy.policy_id || policy.id, source: filePath }
            }));
        }
    }

    // 5. Troubleshooting
    if (Array.isArray(data.troubleshooting)) {
        for (const ts of data.troubleshooting) {
            const text = `Troubleshooting Issue: ${ts.issue || ts.problem}\nResolution: ${ts.resolution || ts.solution}`;
            documents.push(new Document({
                pageContent: text,
                metadata: { type: 'troubleshooting', id: ts.ts_id || ts.id, source: filePath }
            }));
        }
    }
    
    // 6. Support Tickets
    if (Array.isArray(data.support_tickets)) {
        for (const ticket of data.support_tickets) {
            const text = `Past Support Ticket - Issue: ${ticket.issue || ticket.description}\nResolution: ${ticket.resolution || ticket.answer}`;
            documents.push(new Document({
                pageContent: text,
                metadata: { type: 'support_ticket', id: ticket.ticket_id || ticket.id, source: filePath }
            }));
        }
    }

    return documents;
}
