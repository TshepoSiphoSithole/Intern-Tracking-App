import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/InternFileUploadHandler.uploadFile';

export default class InternDocumentUpload extends LightningElement {
    @api recordId;  // The Intern Profile record Id
    @track documents = [
        { label: 'ID Document', type: 'ID', file: null, uploaded: false },
        { label: 'CV', type: 'CV', file: null, uploaded: false },
        { label: 'Academic Certificate', type: 'Certificate', file: null, uploaded: false }
    ];

    // Handle file selection
    handleFileChange(event) {
        const docType = event.target.dataset.docType;
        const file = event.target.files[0];

        if (file) {
            this.documents = this.documents.map(doc => 
                doc.type === docType ? { ...doc, file } : doc
            );
        }
    }

    // Upload files
    async handleUpload() {
        for (let doc of this.documents) {
            if (doc.file) {
                let fileReader = new FileReader();
                fileReader.onload = async () => {
                    let base64 = fileReader.result.split(',')[1];
                    try {
                        await uploadFile({ 
                            fileName: doc.file.name, 
                            base64Data: base64, 
                            recordId: this.recordId 
                        });
                        doc.uploaded = true;
                        this.showToast('Success', `${doc.label} uploaded successfully`, 'success');
                        this.documents = [...this.documents]; // Refresh UI
                    } catch (error) {
                        this.showToast('Error', `Failed to upload ${doc.label}`, 'error');
                    }
                };
                fileReader.readAsDataURL(doc.file);
            }
        }
    }

    // Show toast messages
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}