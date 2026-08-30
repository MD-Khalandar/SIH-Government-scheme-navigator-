// Document service - Mock implementation
// Replace with actual API calls later

import { mockDocuments } from '../data/mockSchemes.js';

export const documentService = {
  // Get all documents
  getDocuments: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const savedJson = localStorage.getItem("sahayak_documents");
    if (savedJson) {
      return { success: true, data: JSON.parse(savedJson) };
    }
    
    return { success: true, data: mockDocuments };
  },

  // Update document status
  updateDocumentStatus: async (documentId, status) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const docsJson = localStorage.getItem("sahayak_documents");
    let documents = docsJson ? JSON.parse(docsJson) : [...mockDocuments];
    
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      doc.ready = status;
      localStorage.setItem("sahayak_documents", JSON.stringify(documents));
    }
    
    return { success: true };
  },

  // Get documents for a scheme
  getSchemeDocuments: async (scheme) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const allDocs = await this.getDocuments();
    const schemeDocNames = scheme.documents || [];
    
    const schemeDocs = allDocs.data
      .filter(doc => schemeDocNames.includes(doc.name))
      .map(doc => ({
        ...doc,
        required: true,
        usedBy: [scheme.name]
      }));
    
    return { success: true, data: schemeDocs };
  },

  // Get document readiness for schemes
  getDocumentReadiness: async (schemes) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const allDocs = await this.getDocuments();
    const readyCount = allDocs.data.filter(d => d.ready).length;
    const percentage = allDocs.data.length > 0 
      ? Math.round((readyCount / allDocs.data.length) * 100) 
      : 0;
    
    return { 
      success: true, 
      data: {
        ready: readyCount,
        total: allDocs.data.length,
        percentage
      }
    };
  },

  // Get missing documents for schemes
  getMissingDocuments: async (schemes) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const allDocs = await this.getDocuments();
    const docsMap = new Map(allDocs.data.map(d => [d.name, d]));
    
    const missingDocs = new Set();
    schemes.forEach(scheme => {
      scheme.documents.forEach(docName => {
        const doc = docsMap.get(docName);
        if (doc && !doc.ready) {
          missingDocs.add(docName);
        }
      });
    });
    
    return { success: true, data: Array.from(missingDocs) };
  }
};

export default documentService;
