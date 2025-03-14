import { LightningElement, api, track } from 'lwc';
import assignCertificationToIntern from '@salesforce/apex/CertificationHandlerController.assignCertificationToIntern';

export default class AssignCertification extends LightningElement {
    @api recordId; // recordId represents the current intern profile record ID
    @track isSuccess = false;
    @track isError = false;
    
    // Handle the certification assignment
    handleAssignCertification() {
        // Specify the certification ID to assign (this can be dynamic or come from a list)
        const certificationId = 'your_certification_record_id'; // Replace with actual Certification record ID

        // Call Apex method to assign the certification
        assignCertificationToIntern({ internProfileId: this.recordId, certificationId: certificationId })
            .then(result => {
                if (result) {
                    this.isSuccess = true;
                    this.isError = false;
                } else {
                    this.isSuccess = false;
                    this.isError = true;
                }
            })
            .catch(error => {
                this.isSuccess = false;
                this.isError = true;
                console.error('Error assigning certification:', error);
            });
    }
}
