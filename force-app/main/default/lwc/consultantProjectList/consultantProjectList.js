import { LightningElement, api, wire } from 'lwc';
import getAssignedConsultants from '@salesforce/apex/ConsultantProjectController.getAssignedConsultants';

export default class ConsultantProjectList extends LightningElement {
    @api recordId; // This receives the Project Id when placed on a Project record page
    assignedConsultants = [];
    error;

    @wire(getAssignedConsultants, { projectId: '$recordId' })
    wiredConsultants({ error, data }) {
        if (data) {
            this.assignedConsultants = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.assignedConsultants = [];
        }
    }
}